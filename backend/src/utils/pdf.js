const puppeteer = require('puppeteer');

/**
 * Generate a 2-page GICL Membership ID Card PDF
 * Page 1: Front of card (name, photo, GICL ID, blood group, badge)
 * Page 2: Back of card (emergency contact, address, authorized sign)
 *
 * @param {Object} player - Full player row from DB
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateIdCardPDF(player) {
  const name       = `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'GICL Player';
  const giclId     = player.gicl_id || 'N/A';
  const bloodGroup = player.blood_group || 'N/A';
  const dob        = player.dob ? new Date(player.dob).toLocaleDateString('en-IN') : 'N/A';
  const phone      = player.whatsapp || 'N/A';
  const emergency  = player.emergency_contact || 'N/A';
  const parentName = player.parent_name || 'N/A';
  const address    = [
    player.address_line1,
    player.address_line2,
    player.city,
    player.country,
    player.zip_code,
  ].filter(Boolean).join(', ') || 'N/A';
  const photoUrl   = player.profile_photo_url || '';
  const plan       = player.plan || 'Member';
  const issueDate  = new Date().toLocaleDateString('en-IN');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; background: white; }

    /* ====== PAGE 1: FRONT ====== */
    .card-front {
      width: 148mm;
      height: 105mm;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      display: flex;
      flex-direction: column;
      padding: 6mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }
    .card-front::before {
      content: '';
      position: absolute;
      top: -20mm;
      right: -20mm;
      width: 60mm;
      height: 60mm;
      background: rgba(255,215,0,0.08);
      border-radius: 50%;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.5mm solid #FFD700;
      padding-bottom: 3mm;
      margin-bottom: 4mm;
    }
    .org-name {
      font-size: 14pt;
      font-weight: 900;
      color: #FFD700;
      letter-spacing: 2px;
    }
    .org-sub {
      font-size: 5pt;
      color: #aaa;
      letter-spacing: 1px;
    }
    .badge {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #000;
      font-size: 6pt;
      font-weight: 900;
      padding: 1.5mm 3mm;
      border-radius: 2mm;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .main-content {
      display: flex;
      gap: 5mm;
      flex: 1;
    }
    .photo-section {
      width: 28mm;
      flex-shrink: 0;
    }
    .photo-box {
      width: 28mm;
      height: 35mm;
      border: 0.5mm solid #FFD700;
      border-radius: 2mm;
      background: #222;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .photo-placeholder {
      color: #555;
      font-size: 7pt;
      text-align: center;
    }
    .info-section {
      flex: 1;
    }
    .player-name {
      font-size: 13pt;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2mm;
    }
    .info-row {
      display: flex;
      gap: 3mm;
      margin-bottom: 1.5mm;
    }
    .info-item {
      flex: 1;
    }
    .info-label {
      font-size: 5pt;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 7pt;
      color: #fff;
      font-weight: bold;
    }
    .gicl-id-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #FFD700, #FFA500);
      padding: 2mm 6mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .gicl-id-text {
      font-size: 9pt;
      font-weight: 900;
      color: #000;
      letter-spacing: 2px;
    }
    .issue-date {
      font-size: 6pt;
      color: #333;
    }

    /* ====== PAGE 2: BACK ====== */
    .card-back {
      width: 148mm;
      height: 105mm;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      padding: 6mm;
      position: relative;
      overflow: hidden;
    }
    .back-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.5mm solid #FFD700;
      padding-bottom: 2mm;
      margin-bottom: 4mm;
    }
    .back-section-title {
      font-size: 6pt;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1.5mm;
    }
    .back-value {
      font-size: 8pt;
      color: #fff;
      margin-bottom: 3mm;
    }
    .emergency-grid {
      display: flex;
      gap: 8mm;
      margin-bottom: 4mm;
    }
    .emergency-item { flex: 1; }
    .property-notice {
      background: rgba(255,215,0,0.1);
      border: 0.3mm solid #FFD700;
      border-radius: 1.5mm;
      padding: 2mm 3mm;
      font-size: 6pt;
      color: #FFD700;
      text-align: center;
      margin-bottom: 4mm;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 0.3mm solid #333;
      padding-top: 2mm;
    }
    .sig-item {
      text-align: center;
    }
    .sig-line {
      width: 35mm;
      height: 0.3mm;
      background: #555;
      margin-bottom: 1mm;
    }
    .sig-label {
      font-size: 5pt;
      color: #888;
      text-transform: uppercase;
    }
    .back-gicl-id {
      position: absolute;
      bottom: 2mm;
      left: 50%;
      transform: translateX(-50%);
      font-size: 6pt;
      color: #555;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>

<!-- PAGE 1: FRONT -->
<div class="card-front">
  <div class="top-bar">
    <div>
      <div class="org-name">GICL</div>
      <div class="org-sub">GLOBAL INSTITUTE OF CRICKET LEAGUE</div>
    </div>
    <div class="badge">${plan.toUpperCase()} MEMBER</div>
  </div>

  <div class="main-content">
    <div class="photo-section">
      <div class="photo-box">
        ${photoUrl
          ? `<img src="${photoUrl}" alt="Player Photo" />`
          : `<div class="photo-placeholder">PHOTO</div>`
        }
      </div>
    </div>
    <div class="info-section">
      <div class="player-name">${name}</div>
      <div class="info-row">
        <div class="info-item">
          <div class="info-label">Date of Birth</div>
          <div class="info-value">${dob}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Blood Group</div>
          <div class="info-value" style="color: #FF6B6B;">${bloodGroup}</div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-item">
          <div class="info-label">WhatsApp</div>
          <div class="info-value">${phone}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="gicl-id-bar">
    <div class="gicl-id-text">${giclId}</div>
    <div class="issue-date">Issued: ${issueDate}</div>
  </div>
</div>

<!-- PAGE 2: BACK -->
<div class="card-back">
  <div class="back-header">
    <div class="org-name" style="font-size:10pt;">GICL</div>
    <div class="badge">${plan.toUpperCase()} MEMBER</div>
  </div>

  <div class="emergency-grid">
    <div class="emergency-item">
      <div class="back-section-title">Parent / Guardian</div>
      <div class="back-value">${parentName}</div>
    </div>
    <div class="emergency-item">
      <div class="back-section-title">Emergency Contact</div>
      <div class="back-value" style="color: #FF6B6B;">${emergency}</div>
    </div>
  </div>

  <div>
    <div class="back-section-title">Address</div>
    <div class="back-value" style="font-size: 7pt;">${address}</div>
  </div>

  <div class="property-notice">
    This card is the property of GICL. If found, please return to the nearest GICL office.
  </div>

  <div class="signatures">
    <div class="sig-item">
      <div class="sig-line"></div>
      <div class="sig-label">Card Holder Signature</div>
    </div>
    <div class="sig-item">
      <div class="sig-line"></div>
      <div class="sig-label">Authorized Signatory</div>
    </div>
  </div>

  <div class="back-gicl-id">${giclId}</div>
</div>

</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A6',          // 105mm x 148mm — standard ID card size
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}

module.exports = { generateIdCardPDF };
