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
    .select('id, gicl_id, first_name, last_name, dob, email, whatsapp, city, plan, payment_status, docs_approved, batting_style, bowling_style, profile_photo_url, training_attempt_url')
    .eq('allocated_coach_id', req.user.id)
    .order('first_name', { ascending: true });
  if (error) throw new Error(error.message);
  res.json({ success: true, players: players || [] });
});

exports.getVideos = asyncHandler(async (req, res) => {
  // Fetch players allotted to this coach who have submitted a video
  const { data: players, error } = await supabase
    .from('players')
    .select('id, first_name, last_name, gicl_id, profile_photo_url, training_attempt_url, training_attempt_status, training_attempt_review, training_attempt_flag')
    .eq('allocated_coach_id', req.user.id)
    .not('training_attempt_url', 'is', null);

  if (error) throw new Error(error.message);

  // Map to the format the frontend expects for videos
  const videos = players
    .filter(p => p.training_attempt_url && p.training_attempt_url.trim().length > 0)
    .map(p => ({
      id: p.id, // we use player.id as the video ID since it's 1:1
      player_id: p.id,
      url: p.training_attempt_url,
      title: 'Basic Tutorials Attempt',
      thumbnail: p.profile_photo_url || '/images/default-avatar.png',
      status: p.training_attempt_status || 'Pending',
      review_flag: p.training_attempt_flag,
      review_comment: p.training_attempt_review,
      playerName: `${p.first_name} ${p.last_name}`,
      players: {
        first_name: p.first_name,
        last_name: p.last_name,
        gicl_id: p.gicl_id,
        profile_photo_url: p.profile_photo_url
      }
    }));

  res.json({ success: true, videos });
});

exports.reviewVideo = asyncHandler(async (req, res) => {
  const { flag, comment } = req.body; // flag: 'green'|'yellow'|'red'
  
  // Here, req.params.id is actually the player.id because we mapped it that way in getVideos
  const { data, error } = await supabase
    .from('players')
    .update({ 
      training_attempt_status: 'Reviewed', 
      training_attempt_flag: flag, 
      training_attempt_review: comment,
      is_dashboard_unlocked: true // Fully unlock dashboard upon any review submission
    })
    .eq('id', req.params.id)
    .select('id, first_name, last_name, training_attempt_url, training_attempt_status, training_attempt_flag, training_attempt_review')
    .single();
    
  if (error) throw new Error(error.message);
  res.json({ success: true, video: data });
});

exports.addUpload = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ success: false, message: 'Title and URL are required.' });

  const { error } = await supabase
    .from('coach_video_uploads')
    .insert({
      coach_id: req.user.id,
      title,
      url,
      status: 'pending'
    });

  if (error) throw new Error(error.message);

  res.json({ success: true, message: 'Upload submitted for admin review.' });
});

exports.getMyUploads = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('coach_video_uploads')
    .select('*')
    .eq('coach_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  res.json({ success: true, uploads: data || [] });
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
