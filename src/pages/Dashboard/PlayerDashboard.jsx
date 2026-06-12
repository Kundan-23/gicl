import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useFormStore } from '../../store/useFormStore';
import { playerAPI } from '../../services/api';
import Swal from 'sweetalert2';
import { User, Award, Activity, Star, Info, Shirt, Users, Video } from 'lucide-react';

const PlayerDashboard = () => {
  const { basicInfo, playerProfile, media, dashboardState, updateDashboard, updateBasicInfo, updatePlayerProfile } = useFormStore();
  const fileInputRef = useRef(null);

  // Track whether we've loaded from API yet — prevents flash redirect
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Sync ALL profile data from backend on every mount (handles refresh / new login)
  useEffect(() => {
    playerAPI.getProfile()
      .then((res) => {
        const p = res.data?.player || res.data;
        if (!p) { setProfileLoaded(true); return; }

        // Calculate age from dob
        let age = '';
        if (p.dob) {
          const diff = Date.now() - new Date(p.dob).getTime();
          age = String(Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)));
        }

        // Sync basicInfo (personal details)
        updateBasicInfo({
          giclId:           p.gicl_id          || basicInfo.giclId,
          firstName:        p.first_name        || basicInfo.firstName,
          lastName:         p.last_name         || basicInfo.lastName,
          dob:              p.dob               || basicInfo.dob,
          gender:           p.gender            || basicInfo.gender,
          whatsapp:         p.whatsapp          || basicInfo.whatsapp,
          bloodGroup:       p.blood_group       || basicInfo.bloodGroup,
          parentName:       p.parent_name       || basicInfo.parentName,
          addressLine1:     p.address_line1     || basicInfo.addressLine1,
          city:             p.city              || basicInfo.city,
          state:            p.city              || basicInfo.state,
          district:         p.city              || basicInfo.district,
          country:          p.country           || basicInfo.country,
          zipCode:          p.zip_code          || basicInfo.zipCode,
          emergencyContact: p.emergency_contact || basicInfo.emergencyContact,
          emergencyContactName: p.emergency_contact_name || basicInfo.emergencyContactName,
          referralCode:     p.referral_code     || basicInfo.referralCode,
          jerseySize:       p.jersey_size       || basicInfo.jerseySize,
          jerseyName:       p.first_name        || basicInfo.jerseyName,
          instagramLink:    p.instagram_link    || basicInfo.instagramLink,
        });

        // Sync playerProfile (cricket details)
        updatePlayerProfile({
          battingStyle:     p.batting_style     || playerProfile.battingStyle,
          bowlingStyle:     p.bowling_style     || playerProfile.bowlingStyle,
          height:           p.height            || playerProfile.height,
          weight:           p.weight            || playerProfile.weight,
          jerseySize:       p.jersey_size       || playerProfile.jerseySize,
          age:              age                 || playerProfile.age,
          ballsSelected:    Array.isArray(p.balls_selected)  ? p.balls_selected  : (playerProfile.ballsSelected  || []),
          fieldPositions:   Array.isArray(p.field_positions) ? p.field_positions : (playerProfile.fieldPositions || []),
          clubsDetails:     Array.isArray(p.clubs_details)   ? p.clubs_details   : (playerProfile.clubsDetails   || []),
          cricketHistory:   Array.isArray(p.cricket_history) ? p.cricket_history : (playerProfile.cricketHistory || []),
          clubAssociated:   p.club_associated   || playerProfile.clubAssociated,
        });

        // Sync dashboardState — use actual DB value, not stale store default
        updateDashboard({
          isDashboardUnlocked: !!p.is_dashboard_unlocked,
          profilePhotoUrl:     p.profile_photo_url || dashboardState.profilePhotoUrl,
          referralPoints:      p.referral_balance  ?? dashboardState.referralPoints,
        });
      })
      .catch(() => { /* silent — show local store data as fallback */ })
      .finally(() => setProfileLoaded(true)); // always mark as loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [photoUploading, setPhotoUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => updateDashboard({ profilePhotoUrl: reader.result });
    reader.readAsDataURL(file);
    // Upload to backend
    setPhotoUploading(true);
    try {
      const res = await playerAPI.uploadPhoto(file);
      const url = res.data?.url;
      if (url) updateDashboard({ profilePhotoUrl: url });
      Swal.fire({ icon: 'success', title: 'Photo Updated!', timer: 1500, showConfirmButton: false,
        background: 'var(--bg-surface)', color: 'var(--text-primary)' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Upload failed', text: 'Please try again.',
        background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: '#FFD700' });
    } finally { setPhotoUploading(false); }
  };

  const [downloadingId, setDownloadingId] = useState(false);

  const handleDownloadIdCard = async () => {
    setDownloadingId(true);
    try {
      Swal.fire({ icon: 'info', title: 'Generating PDF...', text: 'Please wait a moment.', showConfirmButton: false, allowOutsideClick: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });

      const res = await playerAPI.downloadIdCard();
      const d = res.data.cardData;

      if (!d || !d.frontBg) {
        throw new Error('Server is still updating. Please wait 1-2 minutes and try again.');
      }

      // A5 dimensions in mm
      const W = 148;
      const H = 210;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [W, H] });

      // Helper: load image as HTMLImageElement (for jsPDF addImage)
      const loadImg = (src) => new Promise((resolve, reject) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); // gracefully skip missing images
        img.src = src;
      });

      // Load all images in parallel
      const [frontImg, backImg, photoImg, sigImg] = await Promise.all([
        loadImg(d.frontBg),
        loadImg(d.backBg),
        loadImg(d.photoUrl),
        loadImg(d.signatureUrl),
      ]);

      // ===== PAGE 1: FRONT =====
      if (frontImg) pdf.addImage(frontImg, 'PNG', 0, 0, W, H);

      // Photo box (positioned to match the white square on the template)
      if (photoImg) {
        pdf.addImage(photoImg, 'JPEG', 22, 125, 37, 40);
      }

      // Text overlay: GICL ID, Name, Blood Group, Age
      // Positioned to the right of the photo box
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(212, 175, 55); // Gold #D4AF37

      pdf.text(d.giclId, 67, 133);
      pdf.text(d.name, 67, 143);
      pdf.text(d.bloodGroup, 67, 153);
      pdf.text(d.age, 67, 163);

      // ===== PAGE 2: BACK =====
      pdf.addPage([W, H], 'portrait');
      if (backImg) pdf.addImage(backImg, 'PNG', 0, 0, W, H);

      // Emergency Contact text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${d.parentName}`, W / 2, 96, { align: 'center' });
      pdf.text(`${d.emergency}`, W / 2, 103, { align: 'center' });

      // Address (gold text)
      if (d.address) {
        pdf.setFontSize(11);
        pdf.setTextColor(212, 175, 55);
        const addressLines = pdf.splitTextToSize(d.address, 110);
        pdf.text(addressLines, W / 2, 128, { align: 'center' });
      }

      // Signature
      if (sigImg) {
        pdf.addImage(sigImg, 'PNG', 50, 155, 48, 20);
      }

      // Save
      pdf.save(`GICL_ID_Card_${d.giclId || 'Player'}.pdf`);

      Swal.fire({ icon: 'success', title: 'Downloaded!', timer: 1500, showConfirmButton: false, background: 'var(--bg-surface)', color: 'var(--text-primary)' });
    } catch (err) {
      console.error(err);
      let errorMsg = 'Failed to generate PDF. Please try again later.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      }
      Swal.fire({ icon: 'error', title: 'Download failed', text: errorMsg, background: 'var(--bg-surface)', color: 'var(--text-primary)', confirmButtonColor: '#FFD700' });
    } finally {
      setDownloadingId(false);
    }
  };

  // Show spinner while waiting for API — prevents flash redirect
  if (!profileLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--bg-surface-elevated)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading your profile…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Only redirect after we have real data from API
  if (!dashboardState.isDashboardUnlocked) {
    return <Navigate to="/dashboard/tutorials" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h1 className="heading-1" style={{ marginBottom: '1.5rem' }}>Dashboard</h1>

      {/* Profile Header & Points */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--bg-surface-elevated)' }}>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                border: '2px solid var(--brand-primary)'
              }}
            >
              {dashboardState.profilePhotoUrl ? (
                <img src={dashboardState.profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="var(--text-secondary)" />
              )}
            </div>
            <button 
              onClick={() => !photoUploading && fileInputRef.current.click()}
              style={{ 
                position: 'absolute', bottom: -5, right: -5, backgroundColor: photoUploading ? 'var(--text-secondary)' : 'var(--brand-accent)', 
                color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-surface)',
                cursor: photoUploading ? 'wait' : 'pointer', fontSize: '16px', fontWeight: 700
              }}
              title={photoUploading ? 'Uploading...' : 'Change photo'}
            >
              {photoUploading ? '⟳' : '+'}
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
          </div>
          <div>
            <h2 className="heading-2">{basicInfo.firstName || 'Player Name'} {basicInfo.lastName}</h2>
            <p className="text-secondary">{playerProfile.cricketType || 'Cricket'} Player | ID: {basicInfo.giclId || 'PENDING'}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.battingStyle || 'BAT'}</span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{playerProfile.bowlingStyle || 'BOWL'}</span>
              {(playerProfile.clubsDetails && playerProfile.clubsDetails.length > 0) && (
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,199,44,0.2)', color: 'var(--brand-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  Club Player
                </span>
              )}
            </div>
            {basicInfo.giclId && (
              <button 
                onClick={handleDownloadIdCard}
                disabled={downloadingId}
                style={{ 
                  marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'var(--brand-primary)', color: '#121A3F', fontWeight: 700, 
                  border: 'none', cursor: downloadingId ? 'wait' : 'pointer', fontSize: '0.85rem'
                }}
              >
                {downloadingId ? 'Generating PDF...' : '⬇ Download ID Card'}
              </button>
            )}
          </div>
        </div>

        {/* Points Card */}
        <div style={{ backgroundColor: 'var(--brand-primary)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <Award size={150} />
          </div>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Referral Balance</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{dashboardState.referralPoints}</h1>
            <span style={{ fontWeight: 600 }}>Pts</span>
          </div>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>Keep referring to earn more!</p>
        </div>

      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Personal Details Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} color="var(--brand-primary)" />
            Personal Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Gender / Age</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.gender || 'N/A'} / {playerProfile.age || 'N/A'} Years</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Height / Weight</span>
              <span style={{ fontWeight: 500 }}>{playerProfile.height || 'N/A'} cm / {playerProfile.weight || 'N/A'} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Location</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.city || basicInfo.state || 'N/A'}, {basicInfo.country || basicInfo.district || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Referred By Code</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.referralCodeUsed || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Cricket & Club Details Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--brand-primary)" />
            Cricket Profile
          </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Ball Types</span>
                <span style={{ fontWeight: 500 }}>{(playerProfile.ballsSelected || []).join(', ') || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Clubs & Permissions</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(playerProfile.clubsDetails && playerProfile.clubsDetails.length > 0) ? (
                    playerProfile.clubsDetails.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Outside? <strong style={{ color: c.allowedOutside === 'yes' ? 'var(--success)' : 'var(--error)' }}>{c.allowedOutside.toUpperCase()}</strong></span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>None</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span className="text-small text-secondary">Fielding</span>
                <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {(playerProfile.fieldPositions || []).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Kit & Gear Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shirt size={20} color="var(--brand-primary)" />
            Kit & Gear
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Jersey Name</span>
              <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>{basicInfo.jerseyName || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-surface-elevated)', paddingBottom: '0.5rem' }}>
              <span className="text-small text-secondary">Jersey Size</span>
              <span style={{ fontWeight: 500 }}>{basicInfo.jerseySize || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Mini Calendar Widget */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--bg-surface-elevated)' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="var(--brand-primary)" />
            Next Match
          </h3>
          
          {dashboardState.upcomingMatches && dashboardState.upcomingMatches.length > 0 ? (
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--brand-accent)', fontWeight: 600 }}>{dashboardState.upcomingMatches[0].type}</span>
                <span className="text-small">{new Date(dashboardState.upcomingMatches[0].date).toLocaleDateString()}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>vs {dashboardState.upcomingMatches[0].opponent}</p>
              <p className="text-small">📍 {dashboardState.upcomingMatches[0].location}</p>
            </div>
          ) : (
             <p className="text-secondary">No upcoming matches scheduled.</p>
          )}
        </div>

      </div>

    </motion.div>
  );
};

export default PlayerDashboard;
