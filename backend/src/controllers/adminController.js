const supabase     = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// ─── GET /api/admin/stats ─────────────────────────────────────────
exports.getStats = asyncHandler(async (req, res) => {
  const [
    { count: totalPlayers },
    { count: paidPlayers },
    { count: pendingCashouts },
    { data: recentPlayers },
    { data: cashoutSum },
  ] = await Promise.all([
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    supabase.from('cashout_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('players').select('id, first_name, last_name, gicl_id, email, plan, payment_status, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('cashout_requests').select('amount').eq('status', 'approved'),
  ]);

  const totalPaidOut = (cashoutSum || []).reduce((sum, c) => sum + (c.amount || 0), 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase.from('players').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString());

  res.json({
    success: true,
    stats: { totalPlayers, paidPlayers, pendingCashouts, todayRegistrations: todayCount, totalPaidOut },
    recentPlayers: recentPlayers || [],
  });
});

// ─── GET /api/admin/players ───────────────────────────────────────
exports.getPlayers = asyncHandler(async (req, res) => {
  const { search, plan, payment, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('players')
    .select('id, gicl_id, first_name, last_name, email, whatsapp, gender, dob, plan, payment_status, docs_approved, is_dashboard_unlocked, referral_code, referral_balance, allocated_coach_id, created_at, profile_photo_url, city, country, batting_style, bowling_style', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (search) query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,gicl_id.ilike.%${search}%`);
  if (plan)    query = query.eq('plan', plan);
  if (payment) query = query.eq('payment_status', payment);

  const { data: players, count, error } = await query;
  if (error) throw new Error(error.message);

  res.json({ success: true, players: players || [], total: count, page: Number(page), limit: Number(limit) });
});

// ─── GET /api/admin/players/:id ───────────────────────────────────
exports.getPlayerDetail = asyncHandler(async (req, res) => {
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !player) return res.status(404).json({ success: false, message: 'Player not found.' });
  delete player.password_hash;

  const { data: referrals } = await supabase.from('referrals').select('*').eq('referrer_id', req.params.id).order('created_at', { ascending: false });
  const { data: cashouts }  = await supabase.from('cashout_requests').select('*').eq('player_id', req.params.id).order('created_at', { ascending: false });

  res.json({ success: true, player, referrals: referrals || [], cashouts: cashouts || [] });
});

// ─── PUT /api/admin/players/:id/status ───────────────────────────
exports.updatePlayerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { error } = await supabase.from('players').update({ status }).eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: `Player status updated to ${status}.` });
});

// ─── PUT /api/admin/players/:id/approve-docs ─────────────────────
exports.approveDocs = asyncHandler(async (req, res) => {
  const { error } = await supabase.from('players').update({ docs_approved: true }).eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Documents approved.' });
});

// ─── PUT /api/admin/players/:id/assign-coach ─────────────────────
exports.assignCoach = asyncHandler(async (req, res) => {
  const { coachId } = req.body;
  const { error } = await supabase.from('players').update({ allocated_coach_id: coachId || null }).eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Coach assigned.' });
});

// ─── GET /api/admin/payments ──────────────────────────────────────
exports.getPayments = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('players')
    .select('id, gicl_id, first_name, last_name, email, plan, payment_status, payment_id, payment_order_id, created_at')
    .not('payment_status', 'is', null)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  res.json({ success: true, payments: data || [] });
});

// ─── GET /api/admin/referrals ─────────────────────────────────────
exports.getReferrals = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, referrer_id(first_name, last_name, gicl_id, email), referred_id(first_name, last_name, gicl_id, email)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  res.json({ success: true, referrals: data || [] });
});

// ─── GET /api/admin/cashouts ──────────────────────────────────────
exports.getCashouts = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let query = supabase
    .from('cashout_requests')
    .select('*, player_id(id, first_name, last_name, gicl_id, email)')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  res.json({ success: true, cashouts: data || [] });
});

// ─── PUT /api/admin/cashouts/:id/approve ─────────────────────────
exports.approveCashout = asyncHandler(async (req, res) => {
  const { adminNote } = req.body;
  const { data: cashout, error: fetchErr } = await supabase.from('cashout_requests').select('*').eq('id', req.params.id).single();
  if (fetchErr || !cashout) return res.status(404).json({ success: false, message: 'Cashout not found.' });
  if (cashout.status !== 'pending') return res.status(400).json({ success: false, message: 'Already processed.' });

  const { error } = await supabase.from('cashout_requests')
    .update({ status: 'approved', admin_note: adminNote || 'Approved', resolved_at: new Date().toISOString() })
    .eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Cashout approved.' });
});

// ─── PUT /api/admin/cashouts/:id/reject ──────────────────────────
exports.rejectCashout = asyncHandler(async (req, res) => {
  const { adminNote } = req.body;
  if (!adminNote) return res.status(400).json({ success: false, message: 'Rejection reason required.' });

  const { data: cashout, error: fetchErr } = await supabase.from('cashout_requests').select('*').eq('id', req.params.id).single();
  if (fetchErr || !cashout) return res.status(404).json({ success: false, message: 'Cashout not found.' });
  if (cashout.status !== 'pending') return res.status(400).json({ success: false, message: 'Already processed.' });

  // Refund balance
  const { data: player } = await supabase.from('players').select('referral_balance').eq('id', cashout.player_id).single();
  await supabase.from('players').update({ referral_balance: (player?.referral_balance || 0) + cashout.amount }).eq('id', cashout.player_id);

  await supabase.from('cashout_requests').update({ status: 'rejected', admin_note: adminNote, resolved_at: new Date().toISOString() }).eq('id', req.params.id);
  res.json({ success: true, message: 'Cashout rejected. Balance refunded to player.' });
});

// ─── Coaches CRUD ─────────────────────────────────────────────────
exports.getCoaches = asyncHandler(async (req, res) => {
  const { data } = await supabase.from('coaches')
    .select('id, first_name, last_name, email, whatsapp, status, gicl_id, created_at, profile_photo_url, city, zip_code, batting_style, bowling_style, blood_group, dob, gender, cricket_history, coaching_history, teams, birth_cert_url, address_proof_url')
    .order('created_at', { ascending: false });
  res.json({ success: true, coaches: data || [] });
});

exports.createCoach = asyncHandler(async (req, res) => {
  const bcrypt = require('bcryptjs');
  const { generateCoachGiclId } = require('../utils/giclId');
  const { generateReferralCode } = require('../utils/referralCode');
  const {
    firstName, lastName, email, whatsapp, password,
    dob, gender, bloodGroup, emergencyContact, emergencyContactName,
    addressLine1, addressLine2, city, country, zipCode, stateCode,
    battingStyle, bowlingStyle, jerseySize, instagramLink,
    cricketHistory, coachingHistory, referredByPhone,
    profilePhotoUrl,
  } = req.body;

  const password_hash = await bcrypt.hash(password || 'GICL@Coach123', 12);
  const gicl_id = await generateCoachGiclId(zipCode);
  const referral_code = generateReferralCode();

  const insertData = {
    first_name: firstName,
    last_name: lastName,
    email,
    whatsapp,
    password_hash,
    role: 'coach',
    status: 'Active',
    gicl_id,
    referral_code,
  };

  if (dob)                    insertData.dob                    = dob;
  if (gender)                 insertData.gender                 = gender;
  if (bloodGroup)             insertData.blood_group            = bloodGroup;
  if (emergencyContact)       insertData.emergency_contact      = emergencyContact;
  if (emergencyContactName)   insertData.emergency_contact_name = emergencyContactName;
  if (addressLine1)           insertData.address_line1          = addressLine1;
  if (addressLine2)           insertData.address_line2          = addressLine2;
  if (city)                   insertData.city                   = city;
  if (country)                insertData.country                = country;
  if (zipCode)                insertData.zip_code               = zipCode;
  if (stateCode)              insertData.state_code             = stateCode;
  if (battingStyle)           insertData.batting_style          = battingStyle;
  if (bowlingStyle)           insertData.bowling_style          = bowlingStyle;
  if (jerseySize)             insertData.jersey_size            = jerseySize;
  if (instagramLink)          insertData.instagram_link         = instagramLink;
  if (cricketHistory)         insertData.cricket_history        = cricketHistory;
  if (coachingHistory)        insertData.coaching_history       = coachingHistory;
  if (referredByPhone)        insertData.referred_by_phone      = referredByPhone;
  if (profilePhotoUrl)        insertData.profile_photo_url      = profilePhotoUrl;

  const { data, error } = await supabase.from('coaches').insert(insertData).select().single();
  if (error) throw new Error('Failed to create coach: ' + error.message);
  res.status(201).json({ success: true, message: 'Coach created.', coach: data });
});

exports.updateCoach = asyncHandler(async (req, res) => {
  const bcrypt = require('bcryptjs');
  const {
    firstName, lastName, whatsapp, status, password,
    dob, gender, bloodGroup, emergencyContact, emergencyContactName,
    addressLine1, addressLine2, city, country, zipCode, stateCode,
    battingStyle, bowlingStyle, jerseySize, instagramLink,
    cricketHistory, coachingHistory, referredByPhone,
    profilePhotoUrl,
  } = req.body;

  const updateData = {};
  if (firstName !== undefined)           updateData.first_name             = firstName;
  if (lastName  !== undefined)           updateData.last_name              = lastName;
  if (whatsapp  !== undefined)           updateData.whatsapp               = whatsapp;
  if (status    !== undefined)           updateData.status                 = status;
  if (dob       !== undefined)           updateData.dob                    = dob;
  if (gender    !== undefined)           updateData.gender                 = gender;
  if (bloodGroup !== undefined)          updateData.blood_group            = bloodGroup;
  if (emergencyContact !== undefined)    updateData.emergency_contact      = emergencyContact;
  if (emergencyContactName !== undefined)updateData.emergency_contact_name = emergencyContactName;
  if (addressLine1 !== undefined)        updateData.address_line1          = addressLine1;
  if (addressLine2 !== undefined)        updateData.address_line2          = addressLine2;
  if (city !== undefined)                updateData.city                   = city;
  if (country !== undefined)             updateData.country                = country;
  if (zipCode !== undefined)             updateData.zip_code               = zipCode;
  if (stateCode !== undefined)           updateData.state_code             = stateCode;
  if (battingStyle !== undefined)        updateData.batting_style          = battingStyle;
  if (bowlingStyle !== undefined)        updateData.bowling_style          = bowlingStyle;
  if (jerseySize !== undefined)          updateData.jersey_size            = jerseySize;
  if (instagramLink !== undefined)       updateData.instagram_link         = instagramLink;
  if (cricketHistory !== undefined)      updateData.cricket_history        = cricketHistory;
  if (coachingHistory !== undefined)     updateData.coaching_history       = coachingHistory;
  if (referredByPhone !== undefined)     updateData.referred_by_phone      = referredByPhone;
  if (profilePhotoUrl !== undefined)     updateData.profile_photo_url      = profilePhotoUrl;
  if (password)                          updateData.password_hash          = await bcrypt.hash(password, 12);

  const { error } = await supabase.from('coaches').update(updateData).eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Coach updated.' });
});

exports.deleteCoach = asyncHandler(async (req, res) => {
  const { error } = await supabase.from('coaches').delete().eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Coach deleted.' });
});


// ─── Matches CRUD ─────────────────────────────────────────────────
exports.getMatches = asyncHandler(async (req, res) => {
  const { data } = await supabase.from('matches').select('*').order('date', { ascending: true });
  res.json({ success: true, matches: data || [] });
});

exports.createMatch = asyncHandler(async (req, res) => {
  const { opponent, date, venue, type, description } = req.body;
  const { data, error } = await supabase.from('matches')
    .insert({ opponent, date, venue, type: type || 'League Match', description })
    .select().single();
  if (error) throw new Error('Failed to create match: ' + error.message);
  res.status(201).json({ success: true, message: 'Match scheduled.', match: data });
});

exports.updateMatch = asyncHandler(async (req, res) => {
  const { opponent, date, venue, type, description, result } = req.body;
  const updateData = {};
  if (opponent !== undefined)    updateData.opponent    = opponent;
  if (date !== undefined)        updateData.date        = date;
  if (venue !== undefined)       updateData.venue       = venue;
  if (type !== undefined)        updateData.type        = type;
  if (description !== undefined) updateData.description = description;
  if (result !== undefined)      updateData.result      = result;
  const { error } = await supabase.from('matches').update(updateData).eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Match updated.' });
});

exports.deleteMatch = asyncHandler(async (req, res) => {
  const { error } = await supabase.from('matches').delete().eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Match deleted.' });
});

// ─── App Config ───────────────────────────────────────────────────
exports.getConfig = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('app_config').select('*').eq('id', 1).single();
  if (error) throw new Error(error.message);
  res.json({ success: true, config: data });
});

exports.updateConfig = asyncHandler(async (req, res) => {
  const allowed = [
    'plans', 'jersey_sizes', 'batting_styles', 'bowling_styles', 'ball_types',
    'age_groups', 'clubs', 'referral_level1', 'referral_level2', 'referral_level3plus',
    'referral_min_cashout', 'max_squad_size', 'match_team_size',
    'banners', 'ad_banners', 'landing_bg_image', 'registration_terms',
  ];
  const updateData = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updateData[key] = req.body[key];
  }
  if (Object.keys(updateData).length === 0) return res.status(400).json({ success: false, message: 'No valid fields.' });

  const { error } = await supabase.from('app_config').update(updateData).eq('id', 1);

  if (error) {
    // Detect missing column errors — give a clear actionable message
    if (error.message?.includes('column') && error.message?.includes('schema cache')) {
      const colMatch = error.message.match(/'([^']+)' column/);
      const colName = colMatch ? colMatch[1] : 'unknown';
      return res.status(400).json({
        success: false,
        message: `Database column '${colName}' is missing. Please run this SQL in Supabase → SQL Editor:\n\nALTER TABLE app_config ADD COLUMN IF NOT EXISTS ${colName} text DEFAULT '';`,
      });
    }
    throw new Error(error.message);
  }

  res.json({ success: true, message: 'Config updated.' });
});


// ─── Coach Video Uploads ──────────────────────────────────────────

// GET /api/admin/coach-uploads?status=pending|approved|rejected
exports.listCoachUploads = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let query = supabase
    .from('coach_video_uploads')
    .select('*, coach_id(id, first_name, last_name, email)')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  res.json({ success: true, uploads: data || [] });
});

// PUT /api/admin/coach-uploads/:id/approve
exports.approveCoachUpload = asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('coach_video_uploads')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Video approved.' });
});

// PUT /api/admin/coach-uploads/:id/reject
exports.rejectCoachUpload = asyncHandler(async (req, res) => {
  const { adminNote } = req.body;
  if (!adminNote) return res.status(400).json({ success: false, message: 'Rejection reason required.' });
  const { error } = await supabase
    .from('coach_video_uploads')
    .update({ status: 'rejected', rejection_reason: adminNote, reviewed_at: new Date().toISOString() })
    .eq('id', req.params.id);
  if (error) throw new Error(error.message);
  res.json({ success: true, message: 'Video rejected.' });
});

// ─── Upload banner image (dashboard banners / landing bg) ─────────────────
exports.uploadBanner = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ext = req.file.mimetype.split('/')[1];
  const path = `banners/${Date.now()}.${ext}`;
  const { error: uploadError } = await sb.storage.from('banners').upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
  if (uploadError) throw new Error(uploadError.message);
  const { data: { publicUrl } } = sb.storage.from('banners').getPublicUrl(path);
  res.json({ success: true, url: publicUrl });
});

// ─── Upload ad-banner image ───────────────────────────────────────────────
exports.uploadAdBanner = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ext = req.file.mimetype.split('/')[1];
  const path = `ad-banners/${Date.now()}.${ext}`;
  const { error: uploadError } = await sb.storage.from('ad-banners').upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
  if (uploadError) throw new Error(uploadError.message);
  const { data: { publicUrl } } = sb.storage.from('ad-banners').getPublicUrl(path);
  res.json({ success: true, url: publicUrl });
});
