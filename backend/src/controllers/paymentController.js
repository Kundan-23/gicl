const crypto   = require('crypto');
const razorpay = require('../config/razorpay');
const supabase = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');
const { creditReferralChain } = require('./referralController');

// ─── POST /api/payment/create-order ────────────────────────
exports.createOrder = asyncHandler(async (req, res) => {
  const { planId } = req.body;

  // Get plan details from config
  const { data: config } = await supabase
    .from('app_config')
    .select('plans')
    .eq('id', 1)
    .single();

  const plans = config?.plans || [];
  const plan  = plans.find((p) => p.id === planId);

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found.' });
  }

  const amountInPaise = Math.round(plan.price * 100); // Razorpay uses paise

  // Receipt must be ≤40 chars
  const shortId = req.user.id.replace(/-/g, '').slice(0, 16);
  const receipt = `gicl_${shortId}_${Date.now().toString().slice(-8)}`;

  let order;
  try {
    order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        playerId: req.user.id,
        planId,
        planName: plan.name,
      },
    });
  } catch (rzpErr) {
    const msg = rzpErr?.error?.description || rzpErr?.message || 'Razorpay order creation failed.';
    return res.status(502).json({ success: false, message: msg });
  }

  // Save order ID to player record
  await supabase.from('players').update({ payment_order_id: order.id }).eq('id', req.user.id);

  res.json({
    success:  true,
    orderId:  order.id,       // Frontend destructures as { orderId, amount, currency, keyId }
    amount:   order.amount,
    currency: order.currency,
    keyId:    process.env.RAZORPAY_KEY_ID,
    planName: plan.name,
  });
});

// ─── POST /api/payment/verify ───────────────────────────────
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, referralCodeUsed } = req.body;

  // HMAC-SHA256 signature verification
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
  }

  // Get plan from Razorpay order notes
  const order = await razorpay.orders.fetch(razorpay_order_id);
  const planId = order.notes?.planId;

  // Safety net: if referral code was passed at payment time, link it now if not already linked
  if (referralCodeUsed && referralCodeUsed.trim()) {
    const { data: currentPlayer } = await supabase
      .from('players').select('referred_by_id').eq('id', req.user.id).single();

    if (!currentPlayer?.referred_by_id) {
      const { data: referrer } = await supabase
        .from('players').select('id')
        .eq('referral_code', referralCodeUsed.toUpperCase().trim())
        .neq('id', req.user.id).maybeSingle();

      if (referrer) {
        await supabase.from('players').update({ referred_by_id: referrer.id }).eq('id', req.user.id);
        console.log(`[Referral] Linked ${req.user.id} → referrer ${referrer.id} (code: ${referralCodeUsed}) at payment time`);
      }
    }
  }

  // Update player: mark paid, unlock dashboard
  const { data: player, error } = await supabase
    .from('players')
    .update({
      payment_status:        'paid',
      payment_id:            razorpay_payment_id,
      plan:                  planId,
      is_dashboard_unlocked: true,
    })
    .eq('id', req.user.id)
    .select('referred_by_id, referral_balance')
    .single();

  if (error) throw new Error('Failed to update payment status: ' + error.message);

  // Credit multi-level referral chain
  if (player?.referred_by_id) {
    try {
      await creditReferralChain(req.user.id);
      console.log(`[Referral] Chain credited for new player ${req.user.id}`);
    } catch (e) {
      console.error('[Referral] Chain error:', e.message);
    }
  } else {
    console.log(`[Referral] No referred_by_id for player ${req.user.id} — no bonus credited`);
  }

  res.json({
    success: true,
    message: 'Payment verified. Dashboard unlocked!',
    paymentId: razorpay_payment_id,
  });
});

