const { supabase } = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// Fetch practice matches created by Admin (match_type OR type = 'Practice')
exports.getPracticeMatches = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase.from('matches')
      .select('id, title, date, venue, location, match_type, type, total_slots, booked_slots, price_per_slot')
      .or('match_type.eq.Practice,type.eq.Practice,match_type.ilike.practice,type.ilike.practice')
      .order('date', { ascending: true });

    if (error) {
      console.error('[getPracticeMatches] DB error:', error.message);
      return res.json({ success: true, matches: [], _debug: error.message });
    }
    // Normalize: add venue fallback and match_type fallback
    const matches = (data || []).map(m => ({
      ...m,
      venue: m.venue || m.location,
      match_type: m.match_type || m.type
    }));
    res.json({ success: true, matches });
  } catch (err) {
    console.error('[getPracticeMatches] Unexpected error:', err);
    res.json({ success: true, matches: [] });
  }
});

// Coach creates a squad for a practice match
exports.submitMatchSquad = asyncHandler(async (req, res) => {
  const { matchId, playerIds } = req.body;
  const coachId = req.user.id; // from auth middleware
  
  if (!matchId || !playerIds || !Array.isArray(playerIds)) {
    return res.status(400).json({ success: false, message: 'Invalid data.' });
  }

  const { error } = await supabase.from('coach_match_squads')
    .upsert({ match_id: matchId, coach_id: coachId, player_ids: playerIds }, { onConflict: 'match_id,coach_id' });
    
  if (error) throw new Error(error.message);
  res.status(201).json({ success: true, message: 'Squad submitted for the practice match.' });
});

// Coach submits a player training slot for approval
exports.submitTrainingSlot = asyncHandler(async (req, res) => {
  const { trainingType, scheduledTime, playerIds } = req.body;
  const coachId = req.user.id;
  
  if (!trainingType || !scheduledTime || !playerIds || !Array.isArray(playerIds)) {
    return res.status(400).json({ success: false, message: 'Invalid data.' });
  }

  const { error } = await supabase.from('training_slots')
    .insert({
      coach_id: coachId,
      training_type: trainingType,
      scheduled_time: scheduledTime,
      player_ids: playerIds,
      status: 'pending'
    });

  if (error) throw new Error(error.message);
  res.status(201).json({ success: true, message: 'Training slot submitted for approval.' });
});

// Get coach's training slots
exports.getTrainingSlots = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('training_slots')
    .select('*')
    .eq('coach_id', req.user.id)
    .order('scheduled_time', { ascending: false });
    
  if (error) throw new Error(error.message);
  res.json({ success: true, slots: data || [] });
});
