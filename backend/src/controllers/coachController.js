const { v4: uuidv4 } = require('uuid');
const supabase     = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const { data: coach, error } = await supabase.from('coaches').select('*').eq('id', req.user.id).single();
  if (error || !coach) return res.status(404).json({ success: false, message: 'Coach not found.' });
  delete coach.password_hash;
  res.json({ success: true, coach });
});

exports.getPlayers = asyncHandler(async (req, res) => {
  const { data: players, error } = await supabase
    .from('players')
    .select('id, gicl_id, first_name, last_name, email, whatsapp, city, plan, payment_status, docs_approved, batting_style, bowling_style, profile_photo_url')
    .eq('allocated_coach_id', req.user.id)
    .order('first_name', { ascending: true });
  if (error) throw new Error(error.message);
  res.json({ success: true, players: players || [] });
});

exports.getVideos = asyncHandler(async (req, res) => {
  // Get all player IDs allocated to this coach
  const { data: playerRows } = await supabase
    .from('players')
    .select('id')
    .eq('allocated_coach_id', req.user.id);

  if (!playerRows || playerRows.length === 0) {
    return res.json({ success: true, videos: [] });
  }

  const playerIds = playerRows.map((p) => p.id);
  const { data: videos, error } = await supabase
    .from('player_videos')
    .select('*, players(first_name, last_name, gicl_id, profile_photo_url)')
    .in('player_id', playerIds)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  res.json({ success: true, videos: videos || [] });
});

exports.reviewVideo = asyncHandler(async (req, res) => {
  const { flag, comment } = req.body; // flag: 'green'|'yellow'|'red'
  const { data, error } = await supabase
    .from('player_videos')
    .update({ status: 'Reviewed', review_flag: flag, review_comment: comment, reviewed_by: req.user.id })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  res.json({ success: true, video: data });
});

exports.addUpload = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ success: false, message: 'Title and URL are required.' });

  const { data: coach } = await supabase.from('coaches').select('my_uploads').eq('id', req.user.id).single();
  const uploads = coach?.my_uploads || [];
  uploads.push({ id: uuidv4(), title, url, status: 'Pending', date: new Date().toISOString() });

  await supabase.from('coaches').update({ my_uploads: uploads }).eq('id', req.user.id);
  res.json({ success: true, message: 'Upload submitted for admin review.' });
});

exports.getMatches = asyncHandler(async (req, res) => {
  const { data: matchIds } = await supabase.from('match_coaches').select('match_id').eq('coach_id', req.user.id);
  if (!matchIds || matchIds.length === 0) return res.json({ success: true, matches: [] });
  const ids = matchIds.map((m) => m.match_id);
  const { data: matches, error } = await supabase.from('matches').select('*').in('id', ids).order('date', { ascending: true });
  if (error) throw new Error(error.message);
  res.json({ success: true, matches });
});

exports.getReferrals = asyncHandler(async (req, res) => {
  const { data: coach } = await supabase.from('coaches').select('referral_code, referral_points').eq('id', req.user.id).single();
  res.json({ success: true, referralCode: coach?.referral_code, referralPoints: coach?.referral_points || 0 });
});
