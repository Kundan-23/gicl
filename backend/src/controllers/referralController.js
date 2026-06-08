const supabase     = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// ─── Helper: Walk referral chain and credit bonuses ─────────────
async function creditReferralChain(newPlayerId) {
  const { data: cfg } = await supabase
    .from('app_config')
    .select('referral_level1, referral_level2, referral_level3plus')
    .eq('id', 1)
    .single();

  const bonuses = {
    1: cfg?.referral_level1      ?? 50,
    2: cfg?.referral_level2      ?? 20,
    3: cfg?.referral_level3plus  ?? 10,
  };

  let currentId = newPlayerId;
  let level = 0;

  while (true) {
    const { data: player } = await supabase
      .from('players')
      .select('referred_by_id')
      .eq('id', currentId)
      .single();

    if (!player?.referred_by_id) break;
    level++;

    const referrerId = player.referred_by_id;
    const bonus      = level === 1 ? bonuses[1] : level === 2 ? bonuses[2] : bonuses[3];

    const { data: referrer } = await supabase
      .from('players')
      .select('referral_balance')
      .eq('id', referrerId)
      .single();

    const newBalance = (referrer?.referral_balance || 0) + bonus;

    await supabase.from('players').update({ referral_balance: newBalance }).eq('id', referrerId);

    await supabase.from('referrals').insert({
      referrer_id:   referrerId,
      referred_id:   newPlayerId,
      level,
      amount_earned: bonus,
    });

    currentId = referrerId;
  }
}

exports.creditReferralChain = creditReferralChain;

// ─── GET /api/referral/stats ──────────────────────────────────────
exports.getStats = asyncHandler(async (req, res) => {
  const playerId = req.user.id;

  const { data: player } = await supabase
    .from('players')
    .select('referral_code, referral_balance')
    .eq('id', playerId)
    .single();

  const { data: directReferrals } = await supabase
    .from('players')
    .select('id, first_name, last_name, gicl_id, payment_status, created_at')
    .eq('referred_by_id', playerId)
    .order('created_at', { ascending: false });

  const { data: ledger } = await supabase
    .from('referrals')
    .select('*, referred_id(first_name, last_name, gicl_id, created_at)')
    .eq('referrer_id', playerId)
    .order('created_at', { ascending: false });

  const { data: cfg } = await supabase
    .from('app_config')
    .select('referral_min_cashout, referral_level1, referral_level2, referral_level3plus')
    .eq('id', 1)
    .single();

  res.json({
    success: true,
    referralCode:    player?.referral_code,
    balance:         player?.referral_balance || 0,
    minCashout:      cfg?.referral_min_cashout || 500,
    bonusLevels:     { level1: cfg?.referral_level1 ?? 50, level2: cfg?.referral_level2 ?? 20, level3plus: cfg?.referral_level3plus ?? 10 },
    directReferrals: directReferrals || [],
    ledger:          ledger || [],
  });
});

// ─── GET /api/referral/cashouts ───────────────────────────────────
exports.getCashouts = asyncHandler(async (req, res) => {
  const { data: cashouts } = await supabase
    .from('cashout_requests')
    .select('*')
    .eq('player_id', req.user.id)
    .order('created_at', { ascending: false });

  res.json({ success: true, cashouts: cashouts || [] });
});

// ─── POST /api/referral/cashout ───────────────────────────────────
exports.requestCashout = asyncHandler(async (req, res) => {
  const { amount, method, upiId, bankName, accountNo, ifscCode } = req.body;
  const playerId = req.user.id;

  const { data: player } = await supabase
    .from('players')
    .select('referral_balance')
    .eq('id', playerId)
    .single();

  const balance = player?.referral_balance || 0;

  const { data: cfg } = await supabase
    .from('app_config')
    .select('referral_min_cashout')
    .eq('id', 1)
    .single();

  const minCashout = cfg?.referral_min_cashout || 500;

  if (amount < minCashout) {
    return res.status(400).json({ success: false, message: `Minimum cashout is ₹${minCashout}.` });
  }
  if (amount > balance) {
    return res.status(400).json({ success: false, message: `Insufficient balance. Available: ₹${balance}.` });
  }

  const { data: pending } = await supabase
    .from('cashout_requests')
    .select('id')
    .eq('player_id', playerId)
    .eq('status', 'pending')
    .maybeSingle();

  if (pending) {
    return res.status(409).json({ success: false, message: 'You already have a pending cashout request.' });
  }

  if (method === 'upi' && !upiId) {
    return res.status(400).json({ success: false, message: 'UPI ID is required.' });
  }
  if (method === 'bank' && (!bankName || !accountNo || !ifscCode)) {
    return res.status(400).json({ success: false, message: 'Bank name, account number, and IFSC are required.' });
  }

  const { data: cashout, error } = await supabase
    .from('cashout_requests')
    .insert({ player_id: playerId, amount, method, upi_id: upiId || null, bank_name: bankName || null, account_no: accountNo || null, ifsc_code: ifscCode || null })
    .select()
    .single();

  if (error) throw new Error('Failed to submit cashout: ' + error.message);

  // Deduct from balance (held until admin approves)
  await supabase.from('players').update({ referral_balance: balance - amount }).eq('id', playerId);

  res.status(201).json({
    success: true,
    message: `Cashout of ₹${amount} submitted. Admin will process within 3-5 business days.`,
    cashout,
    newBalance: balance - amount,
  });
});

// ─── POST /api/referral/validate-code (PUBLIC) ────────────────────
exports.validateCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Referral code required.' });

  const { data: referrer } = await supabase
    .from('players')
    .select('id, first_name, last_name, gicl_id')
    .eq('referral_code', code.toUpperCase().trim())
    .maybeSingle();

  if (!referrer) {
    return res.status(404).json({ success: false, message: 'Invalid referral code.' });
  }

  res.json({
    success:  true,
    message:  `Valid! Referred by ${(referrer.first_name || '') + ' ' + (referrer.last_name || '')} (${referrer.gicl_id || 'GICL Member'})`,
    referrer: { id: referrer.id, name: `${referrer.first_name || ''} ${referrer.last_name || ''}`.trim() },
  });
});
