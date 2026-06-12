const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Helper to convert local file to base64 data URI
 */
function getLocalImageBase64(filename) {
  try {
    const filePath = path.join(__dirname, '../../assets', filename);
    const buffer = fs.readFileSync(filePath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`Missing asset ${filename}:`, err.message);
    return '';
  }
}

/**
 * Generate a 2-page GICL Membership ID Card PDF in A5 Size
 *
 * @param {Object} player - Full player row from DB
 * @param {String} signatureUrl - Optional Authorized Signature URL from Admin Config
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateIdCardPDF(player, signatureUrl = null) {
  const name       = `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'GICL Player';
  const giclId     = player.gicl_id || 'N/A';
  const bloodGroup = player.blood_group || 'N/A';
  
  let age = 'N/A';
  if (player.dob) {
    const birthDate = new Date(player.dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff); 
    age = Math.abs(ageDate.getUTCFullYear() - 1970) + ' yrs';
  }

  const role       = (player.role || 'Player').toUpperCase();
  const emergency  = player.emergency_contact || 'N/A';
  const parentName = player.parent_name || 'N/A';
  const photoUrl   = player.profile_photo_url || '';

  // Generate QR Code containing GICL ID
  const qrDataUrl = await QRCode.toDataURL(`GICL_ID:${giclId}`, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' }
  });

  const frontBg = getLocalImageBase64('id_card_front.png');
  const backBg = getLocalImageBase64('id_card_back.png');

  const html = `
<div id="id-card-container" style="font-family: 'Inter', sans-serif; background: white; width: 559px; position: relative;">
  <style>
    #id-card-container * { margin: 0; padding: 0; box-sizing: border-box; }
    
    #id-card-container .page {
      width: 559px;
      height: 794px; /* A5 Size Portrait at 96DPI */
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }
    .page:last-of-type {
      page-break-after: auto;
    }

    .bg-img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: -1;
    }

    /* ====== PAGE 1: FRONT ====== */
    .photo-box {
      position: absolute;
      top: 62%; 
      left: 17%;
      width: 25%;
      height: 20%;
      background: #FFF;
      border: 4px solid #D4AF37;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .details-box {
      position: absolute;
      top: 62%;
      left: 45%;
      width: 50%;
      height: 20%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #D4AF37;
    }
    .detail-item {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    /* ====== PAGE 2: BACK ====== */
    .emergency-box {
      position: absolute;
      top: 45.5%;
      left: 10%;
      width: 80%;
      text-align: center;
      color: #FFF;
      font-size: 16px;
      font-weight: 600;
    }

    .address-box {
      position: absolute;
      top: 60%;
      left: 12%;
      width: 76%;
      text-align: center;
      color: #D4AF37;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
    }

    .signature-box {
      position: absolute;
      bottom: 12%;
      left: 50%;
      transform: translateX(-50%);
      width: 35%;
      height: 10%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .signature-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

  </style>
</head>
<body>

<div class="page front">
  <img class="bg-img" src="${frontBg}" alt="Front Background" />
  <div class="photo-box">
    ${photoUrl 
      ? `<img src="${photoUrl}" alt="Photo" />` 
      : `<span style="color:#888; font-size:10pt;"></span>`
    }
  </div>
  
  <div class="details-box">
    <div class="detail-item">${giclId}</div>
    <div class="detail-item">${name}</div>
    <div class="detail-item">${bloodGroup}</div>
    <div class="detail-item">${age}</div>
  </div>
</div>

<div class="page back">
  <img class="bg-img" src="${backBg}" alt="Back Background" />
  <div class="emergency-box">
    ${parentName} - ${emergency}
  </div>
  <div class="address-box">
    <!-- Assuming player address is not stored yet, but if you do add it later, it goes here. For now it's dynamic to the player if available, else blank -->
    ${player.address || ''}
  </div>
  <div class="signature-box">
    ${signatureUrl ? `<img src="${signatureUrl}" alt="Signature" />` : ''}
  </div>
</div>

</div>`;

  return html;
}

module.exports = { generateIdCardPDF };
