const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createBookingOrder = asyncHandler(async (req, res) => {
  const { matchId } = req.body;
  const playerId = req.user.id;

  // Verify match exists and has slots
  const { data: match, error } = await supabase.from('matches').select('*').eq('id', matchId).single();
  
  if (error || !match) {
    return res.status(404).json({ success: false, message: 'Match not found.' });
  }

  if (match.total_slots > 0 && match.booked_slots >= match.total_slots) {
    return res.status(400).json({ success: false, message: 'Match is fully booked.' });
  }

  const amount = Number(match.price_per_slot || 0);

  // If price is 0, allow direct booking
  if (amount === 0) {
    const { error: insertError } = await supabase.from('match_bookings').insert({
      match_id: matchId,
      player_id: playerId,
      amount_paid: 0,
      status: 'confirmed'
    });
    if (insertError) throw new Error('Failed to create booking: ' + insertError.message);
    
    // Increment booked slots
    await supabase.rpc('increment_booked_slots', { p_match_id: matchId });
    
    return res.json({ success: true, isFree: true, message: 'Slot booked successfully!' });
  }

  // Create Razorpay Order
  const options = {
    amount: Math.round(amount * 100), // in paise
    currency: 'INR',
    receipt: `match_${matchId}_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);
  res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
});

exports.verifyBookingPayment = asyncHandler(async (req, res) => {
  const { matchId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const playerId = req.user.id;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
  }

  // Fetch match details to know amount
  const { data: match } = await supabase.from('matches').select('price_per_slot').eq('id', matchId).single();

  // Insert booking
  const { error } = await supabase.from('match_bookings').insert({
    match_id: matchId,
    player_id: playerId,
    razorpay_order_id,
    razorpay_payment_id,
    amount_paid: match?.price_per_slot || 0,
    status: 'confirmed'
  });

  if (error) throw new Error('Failed to record booking: ' + error.message);

  // Increment booked slots (we will need to create this RPC or just update)
  const { data: currentMatch } = await supabase.from('matches').select('booked_slots').eq('id', matchId).single();
  await supabase.from('matches').update({ booked_slots: (currentMatch?.booked_slots || 0) + 1 }).eq('id', matchId);

  res.json({ success: true, message: 'Payment verified and slot booked!' });
});

exports.getAvailableMatches = asyncHandler(async (req, res) => {
  // Show matches that are upcoming and have available slots
  const now = new Date().toISOString();
  const { data, error } = await supabase.from('matches')
    .select('*')
    .gte('date', now)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);
  res.json({ success: true, matches: data || [] });
});
