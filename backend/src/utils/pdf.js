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
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
    
    body { 
      font-family: 'Inter', sans-serif; 
      background: white; 
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 148mm;
      height: 210mm; /* A5 Size Portrait */
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
    }

    .page.front { background-image: url('${frontBg}'); }
    .page.back { background-image: url('${backBg}'); }

    /* ====== PAGE 1: FRONT ====== */
    .photo-box {
      position: absolute;
      top: 61.8%; 
      left: 16.5%;
      width: 25%;
      height: 21.8%;
      background: #eee;
      border: 3px solid #D4AF37;
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
      top: 61.8%;
      left: 45%;
      width: 50%;
      height: 21.8%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      color: #FFF;
    }
    .player-name {
      font-size: 16pt;
      font-weight: 900;
      color: #D4AF37;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .detail-row {
      font-size: 11pt;
      font-weight: 600;
    }
    .detail-label {
      color: #A0A0A0;
      font-size: 9pt;
      text-transform: uppercase;
      margin-right: 5px;
    }

    .qr-code {
      position: absolute;
      bottom: 11%;
      right: 12%;
      width: 16%;
      height: auto;
      border: 2px solid #D4AF37;
      border-radius: 4px;
      padding: 2px;
      background: #FFF;
    }

    /* ====== PAGE 2: BACK ====== */
    .emergency-box {
      position: absolute;
      top: 48%;
      left: 10%;
      width: 80%;
      text-align: center;
      color: #FFF;
      font-size: 13pt;
      font-weight: 600;
    }
    .emergency-name {
      color: #D4AF37;
      margin-bottom: 5px;
    }

    .signature-box {
      position: absolute;
      bottom: 12%;
      left: 50%;
      transform: translateX(-50%);
      width: 40%;
      height: 8%;
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
  <div class="photo-box">
    ${photoUrl 
      ? `<img src="${photoUrl}" alt="Photo" />` 
      : `<span style="color:#888; font-size:10pt;">NO PHOTO</span>`
    }
  </div>
  
  <div class="details-box">
    <div class="player-name">${name}</div>
    <div class="detail-row"><span class="detail-label">ID:</span> ${giclId}</div>
    <div class="detail-row"><span class="detail-label">ROLE:</span> ${role}</div>
    <div class="detail-row"><span class="detail-label">BLOOD/AGE:</span> <span style="color:#FF4B4B">${bloodGroup}</span> &nbsp;|&nbsp; ${age}</div>
  </div>

  <img class="qr-code" src="${qrDataUrl}" alt="QR Code" />
</div>

<div class="page back">
  <div class="emergency-box">
    <div class="emergency-name">${parentName}</div>
    <div>${emergency}</div>
  </div>

  <div class="signature-box">
    ${signatureUrl ? `<img src="${signatureUrl}" alt="Signature" />` : ''}
  </div>
</div>

</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A5',          // 148mm x 210mm
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}

module.exports = { generateIdCardPDF };
