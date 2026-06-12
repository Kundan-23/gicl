const supabase            = require('../config/supabase');
const asyncHandler        = require('../utils/asyncHandler');
const { lookupPincodeState } = require('../utils/pincodeState');

// ─── GET /api/player/profile ────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
  const { data: player, error } = await supabase
    .from('players')
    .select('*, coaches(id, first_name, last_name, email)')
    .eq('id', req.user.id)
    .single();

  if (error || !player) {
    return res.status(404).json({ success: false, message: 'Player not found.' });
  }

  // Never return password hash
  delete player.password_hash;
  res.json({ success: true, player });
});

// ─── PUT /api/player/profile ───────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const body = req.body;

  // Safe coerce to array (guards against undefined / string / null)
  const safeArray = (v) => Array.isArray(v) ? v : (v ? [v] : undefined);

  // Map camelCase request fields → snake_case DB columns
  const updateData = {};
  if (body.firstName        !== undefined) updateData.first_name        = body.firstName;
  if (body.lastName         !== undefined) updateData.last_name         = body.lastName;
  if (body.dob              !== undefined) updateData.dob               = body.dob;
  if (body.gender           !== undefined) updateData.gender            = body.gender;
  if (body.whatsapp             !== undefined) updateData.whatsapp             = body.whatsapp;
  if (body.emergencyContact     !== undefined) updateData.emergency_contact    = body.emergencyContact;
  if (body.emergencyContactName !== undefined) updateData.emergency_contact_name = body.emergencyContactName;
  if (body.bloodGroup       !== undefined) updateData.blood_group       = body.bloodGroup;
  if (body.parentName       !== undefined) updateData.parent_name       = body.parentName;
  if (body.addressLine1     !== undefined) updateData.address_line1     = body.addressLine1;
  if (body.addressLine2     !== undefined) updateData.address_line2     = body.addressLine2;
  if (body.city             !== undefined) updateData.city              = body.city;
  if (body.country          !== undefined) updateData.country           = body.country;
  if (body.zipCode !== undefined) {
    updateData.zip_code = body.zipCode;
  }
  // Resolve state_code separately — stored after the main update so a missing
  // column in the DB does NOT break profile saving.
  let resolvedStateCode = null;
  if (body.zipCode !== undefined) {
    try {
      resolvedStateCode = await lookupPincodeState(body.zipCode);
      console.log(`[Pincode] Resolved state_code=${resolvedStateCode} for pincode ${body.zipCode}`);
    } catch (e) {
      console.error('[Pincode] State lookup failed:', e.message);
    }
  }
  if (body.jerseySize       !== undefined) updateData.jersey_size       = body.jerseySize;
  if (body.instagramLink    !== undefined) updateData.instagram_link    = body.instagramLink;
  if (body.height           !== undefined) updateData.height            = body.height;
  if (body.weight           !== undefined) updateData.weight            = body.weight;
  if (body.battingStyle     !== undefined) updateData.batting_style     = body.battingStyle;
  if (body.bowlingStyle     !== undefined) updateData.bowling_style     = body.bowlingStyle;
  if (body.clubAssociated   !== undefined) updateData.club_associated   = body.clubAssociated;
  // Array fields — always stored as arrays in Supabase (JSONB)
  const fp = safeArray(body.fieldPositions); if (fp !== undefined) updateData.field_positions = fp;
  const bs = safeArray(body.ballsSelected);  if (bs !== undefined) updateData.balls_selected  = bs;
  const ch = safeArray(body.cricketHistory); if (ch !== undefined) updateData.cricket_history  = ch;
  const cd = safeArray(body.clubsDetails);   if (cd !== undefined) updateData.clubs_details    = cd;
  const gl = body.gameplayLinks !== undefined ? body.gameplayLinks : undefined;
  if (gl !== undefined) updateData.gameplay_links = gl;
  const gu = safeArray(body.galleryUrls);    if (gu !== undefined) updateData.gallery_urls     = gu;

  if (Object.keys(updateData).length === 0 && !body.referralCodeUsed) {
    return res.status(400).json({ success: false, message: 'No fields to update.' });
  }

  // Wire referral code to referred_by_id (only on first use)
  if (body.referralCodeUsed && body.referralCodeUsed.trim()) {
    const { data: currentPlayer } = await supabase
      .from('players')
      .select('referred_by_id')
      .eq('id', req.user.id)
      .single();

    if (!currentPlayer?.referred_by_id) {
      const { data: referrer } = await supabase
        .from('players')
        .select('id')
        .eq('referral_code', body.referralCodeUsed.toUpperCase().trim())
        .neq('id', req.user.id)  // Can't refer yourself
        .maybeSingle();

      if (referrer) {
        updateData.referred_by_id = referrer.id;
        console.log(`[Referral] Linked player ${req.user.id} -> referrer ${referrer.id} (code: ${body.referralCodeUsed})`);
      } else {
        // Code was provided but not found — warn the caller so user knows
        console.warn(`[Referral] Code not found: ${body.referralCodeUsed} for player ${req.user.id}`);
        return res.status(400).json({
          success: false,
          message: `Referral code "${body.referralCodeUsed}" is invalid or does not exist. Please check and try again, or leave it blank.`,
        });
      }
    }
  }


  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update.' });
  }


  const { data: player, error } = await supabase
    .from('players')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) throw new Error('Failed to update profile: ' + error.message);

  // ── Save state_code separately (safe — won't crash if column doesn't exist yet) ──
  if (resolvedStateCode) {
    try {
      await supabase.from('players').update({ state_code: resolvedStateCode }).eq('id', req.user.id);
      player.state_code = resolvedStateCode;
    } catch (scErr) {
      // Column may not exist yet — run: ALTER TABLE players ADD COLUMN state_code TEXT;
      console.warn('[Pincode] Could not save state_code (column missing?). Run DB migration 003_state_code.sql');
    }
  }

  // ── Auto-generate GICL ID when gameplay links are submitted (Step 5) ──
  if (gl !== undefined && !player.gicl_id) {
    try {
      // Get next registration number from app_config
      const { data: cfg } = await supabase
        .from('app_config')
        .select('next_registration_number')
        .eq('id', 1)
        .single();

      const regNum    = String(cfg?.next_registration_number || 1).padStart(5, '0');
      const now       = new Date();
      const month     = String(now.getMonth() + 1).padStart(2, '0');
      const year      = String(now.getFullYear());

      // Priority: 1. resolvedStateCode from this request, 2. stored state_code in DB, 3. look up now
      let stateCode = resolvedStateCode || player.state_code;
      if (!stateCode && player.zip_code) {
        stateCode = await lookupPincodeState(player.zip_code);
      }
      stateCode = stateCode || 'IN';

      const giclId = `GICL${regNum}${month}${year}${stateCode}`;

      // Save GICL ID and increment registration counter
      await Promise.all([
        supabase.from('players').update({ gicl_id: giclId }).eq('id', req.user.id),
        supabase.from('app_config').update({ next_registration_number: (cfg?.next_registration_number || 1) + 1 }).eq('id', 1),
      ]);

      player.gicl_id = giclId;
    } catch (idErr) {
      console.error('GICL ID generation failed:', idErr.message);
      // Non-fatal — player can still proceed
    }
  }

  delete player.password_hash;
  res.json({ success: true, message: 'Profile updated.', player });
});

// ─── POST /api/player/upload/photo ──────────────────────────
exports.uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

  const ext  = req.file.mimetype.split('/')[1];
  const path = `${req.user.id}/profile.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(path);

  await supabase.from('players').update({ profile_photo_url: publicUrl }).eq('id', req.user.id);

  res.json({ success: true, message: 'Photo uploaded.', url: publicUrl });
});

// ─── POST /api/player/upload/address-proof ──────────────────
exports.uploadAddressProof = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

  const ext  = req.file.mimetype.split('/')[1];
  const path = `${req.user.id}/address-proof.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

  const { data: { signedUrl } } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year signed URL

  await supabase.from('players').update({ address_proof_url: signedUrl, docs_approved: false }).eq('id', req.user.id);

  res.json({ success: true, message: 'Address proof uploaded. Pending admin approval.', url: signedUrl });
});

// ─── POST /api/player/upload/birth-cert ─────────────────────
exports.uploadBirthCert = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

  const ext  = req.file.mimetype.split('/')[1];
  const path = `${req.user.id}/birth-cert.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

  const { data: { signedUrl } } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  await supabase.from('players').update({ birth_cert_url: signedUrl, docs_approved: false }).eq('id', req.user.id);

  res.json({ success: true, message: 'Birth certificate uploaded. Pending admin approval.', url: signedUrl });
});

// ─── GET /api/player/matches ────────────────────────────────
exports.getMatches = asyncHandler(async (req, res) => {
  const { data: matchIds } = await supabase
    .from('match_players')
    .select('match_id')
    .eq('player_id', req.user.id);

  if (!matchIds || matchIds.length === 0) {
    return res.json({ success: true, matches: [] });
  }

  const ids = matchIds.map((m) => m.match_id);
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .in('id', ids)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);
  res.json({ success: true, matches });
});

// ─── GET /api/player/referrals ─────────────────────────────
exports.getReferrals = asyncHandler(async (req, res) => {
  const { data: player } = await supabase
    .from('players')
    .select('referral_code, referral_balance')
    .eq('id', req.user.id)
    .single();

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, referred_id(first_name, last_name, created_at, payment_status)')
    .eq('referrer_id', req.user.id)
    .order('created_at', { ascending: false });

  res.json({
    success: true,
    referralCode:    player?.referral_code,
    referralBalance: player?.referral_balance || 0,
    referrals:       referrals || [],
  });
});

// ─── GET /api/player/id-card (PDF download) ────────────────
exports.downloadIdCard = asyncHandler(async (req, res) => {
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !player) {
    return res.status(404).json({ success: false, message: 'Player not found.' });
  }

  if (!player.gicl_id) {
    return res.status(400).json({ success: false, message: 'GICL ID not yet generated. Please complete your profile.' });
  }

  const { data: cfg } = await supabase.from('app_config').select('id_card_signature_url').eq('id', 1).single();
  const signatureUrl = cfg?.id_card_signature_url || null;

  const { generateIdCardPDF } = require('../utils/pdf');
  const html = await generateIdCardPDF(player, signatureUrl);

  res.json({ success: true, html });
});
