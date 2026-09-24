import arfLogo from "@/assets/arf-logo-official.png";

export interface LawyerSlipData {
  refNumber: string;
  fullName: string;
  lawFirm?: string;
  email: string;
  university: string;
  phone: string;
  callToBarYear: string;
  casesWon: string | number;
  jurisdictionState?: string;
  practiceAreas?: string[];
  submissionDate: string;
}

/**
 * Renders an ultra-high resolution official ARF Pro Bono Legal Advocate Slip
 * directly to an HTML5 canvas and triggers an instant PNG download.
 */
export async function downloadLawyerSlip(data: LawyerSlipData): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // High-DPI dimensions (2x scale: 1200 x 1600)
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  // Background - Clean Ivory/Parchment
  ctx.fillStyle = "#FBFBF9";
  ctx.fillRect(0, 0, width, height);

  // Outer Border & Legal Guilloche Frame
  ctx.strokeStyle = "#0B3D2E";
  ctx.lineWidth = 14;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Gold accent inner border
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 4;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  // Subtle interior hairline
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(54, 54, width - 108, height - 108);

  // Top Header Banner - Deep Judicial Green
  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(54, 54, width - 108, 220);

  // Gold divider line
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(54, 274, width - 108, 8);

  // Load Logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve(); // fallback gracefully
      logoImg.src = arfLogo;
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, 90, 85, 150, 150);
    }
  } catch {
    // continue if logo fails
  }

  // Header Typography
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 22px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("FEDERAL REPUBLIC OF NIGERIA", 270, 108);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("ABBA ROLLER FOUNDATION", 270, 158);

  ctx.fillStyle = "#A7F3D0";
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("PRO BONO LEGAL DEFENSE CORPS", 270, 196);

  ctx.fillStyle = "#FCD34D";
  ctx.font = "italic 20px system-ui, serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText("“Win a case for the less privileged”", 270, 232);

  // Reference Code Box (Top-Right inside banner)
  const refBoxX = width - 360;
  const refBoxY = 85;
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(refBoxX, refBoxY, 280, 70);
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(refBoxX, refBoxY, 280, 70);

  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("BAR ADVOCATE ID", refBoxX + 16, refBoxY + 26);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px monospace";
  ctx.fillText(data.refNumber, refBoxX + 16, refBoxY + 54);

  // Document Title Plaque
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(80, 310, width - 160, 85);
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 310, width - 160, 85);

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 26px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("OFFICIAL PRO BONO LAWYER ACCREDITATION SLIP", width / 2, 348);

  ctx.fillStyle = "#4B5563";
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(
    "Legal Representation & Human Rights Defense for Indigent & Underprivileged Citizens",
    width / 2,
    375,
  );
  ctx.textAlign = "left"; // reset

  // Scales of Justice Icon / Emblem Watermark in Center
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#0B3D2E";
  ctx.beginPath();
  ctx.arc(width / 2, 900, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Information Cards Layout
  const contentLeft = 80;
  const contentWidth = width - 160;
  let currentY = 425;

  // SECTION 1: Advocate Identity
  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 20px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("1. LEGAL PRACTITIONER IDENTIFICATION", contentLeft, currentY);
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(contentLeft, currentY + 8, contentWidth, 2);

  currentY += 35;

  const rowHeight = 70;
  const halfCol = (contentWidth - 20) / 2;

  // Full Name Box
  drawDataCell(
    ctx,
    contentLeft,
    currentY,
    halfCol,
    rowHeight,
    "FULL NAME OF COUNSEL",
    data.fullName,
    true,
  );

  // Law Firm Box
  drawDataCell(
    ctx,
    contentLeft + halfCol + 20,
    currentY,
    halfCol,
    rowHeight,
    "LAW FIRM / PRACTICE AFFILIATION",
    data.lawFirm?.trim() || "Independent Legal Practitioner",
  );

  currentY += rowHeight + 15;

  // Email Box
  drawDataCell(ctx, contentLeft, currentY, halfCol, rowHeight, "EMAIL ADDRESS", data.email);

  // Phone Box
  drawDataCell(
    ctx,
    contentLeft + halfCol + 20,
    currentY,
    halfCol,
    rowHeight,
    "PHONE / WHATSAPP",
    data.phone,
  );

  currentY += rowHeight + 35;

  // SECTION 2: Academic & Bar Standing
  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 20px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("2. BAR ADMISSION & ADVOCACY RECORD", contentLeft, currentY);
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(contentLeft, currentY + 8, contentWidth, 2);

  currentY += 35;

  // University (LL.B)
  drawDataCell(
    ctx,
    contentLeft,
    currentY,
    contentWidth,
    rowHeight,
    "UNIVERSITY / FACULTY OF LAW (LL.B)",
    data.university,
    true,
  );

  currentY += rowHeight + 15;

  // Year Completed Law School (Call to Bar)
  drawDataCell(
    ctx,
    contentLeft,
    currentY,
    halfCol,
    rowHeight,
    "YEAR COMPLETED LAW SCHOOL (CALL TO BAR)",
    data.callToBarYear,
  );

  // Cases Won So Far (Highlighted Gold Box)
  drawHighlightCell(
    ctx,
    contentLeft + halfCol + 20,
    currentY,
    halfCol,
    rowHeight,
    "CASES WON SO FAR",
    `${data.casesWon} ${Number(data.casesWon) === 1 ? "Case Won" : "Cases Won"} to Date`,
  );

  currentY += rowHeight + 15;

  if (data.jurisdictionState) {
    drawDataCell(
      ctx,
      contentLeft,
      currentY,
      halfCol,
      rowHeight,
      "PRIMARY JURISDICTION / STATE",
      data.jurisdictionState,
    );
  }

  const dateColX = data.jurisdictionState ? contentLeft + halfCol + 20 : contentLeft;
  const dateColW = data.jurisdictionState ? halfCol : contentWidth;
  drawDataCell(
    ctx,
    dateColX,
    currentY,
    dateColW,
    rowHeight,
    "ENROLLMENT DATE",
    data.submissionDate,
  );

  currentY += rowHeight + 35;

  // SECTION 3: Pro Bono Commitment & Legal Aid Mandate
  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 20px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("3. LEGAL DEFENSE PLEDGE & SCOPE", contentLeft, currentY);
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(contentLeft, currentY + 8, contentWidth, 2);

  currentY += 30;

  // Commitment text box
  ctx.fillStyle = "#F0FDF4";
  ctx.fillRect(contentLeft, currentY, contentWidth, 140);
  ctx.strokeStyle = "#86EFAC";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(contentLeft, currentY, contentWidth, 140);

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText("HUMAN RIGHTS & ACCESS TO JUSTICE DECLARATION:", contentLeft + 20, currentY + 30);

  ctx.fillStyle = "#1E293B";
  ctx.font = "14px system-ui, sans-serif";
  const pledgeText =
    "The legal practitioner named herein has officially enlisted in the Abba Roller Foundation Pro Bono Legal Defense Corps to represent indigent citizens, ensure fair trial rights, secure bail for unconvicted detainees, and uphold the rule of law. Verified cases are matched based on regional jurisdiction and specialisation.";
  wrapText(ctx, pledgeText, contentLeft + 20, currentY + 60, contentWidth - 40, 22);

  currentY += 175;

  // Footer: Official Seals, Verification Code, and Signature
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(contentLeft, currentY, contentWidth, 185);
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1;
  ctx.strokeRect(contentLeft, currentY, contentWidth, 185);

  // Left: Official Stamp Simulation
  const sealCenterX = contentLeft + 120;
  const sealCenterY = currentY + 92;
  ctx.save();
  ctx.strokeStyle = "#0B3D2E";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 58, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 10px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ABBA ROLLER FOUNDATION", sealCenterX, sealCenterY - 30);
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillText("⚖️ LEGAL CORPS", sealCenterX, sealCenterY - 4);
  ctx.font = "bold 9px system-ui, sans-serif";
  ctx.fillText("PRO BONO ADVOCATE", sealCenterX, sealCenterY + 16);
  ctx.fillStyle = "#C62828";
  ctx.font = "bold 10px monospace";
  ctx.fillText("VERIFIED", sealCenterX, sealCenterY + 34);
  ctx.restore();

  // Middle: Barcode / Verification
  const barcodeX = contentLeft + 260;
  ctx.fillStyle = "#4B5563";
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillText("DIGITAL VERIFICATION TOKEN", barcodeX, currentY + 45);

  drawBarcodePattern(ctx, barcodeX, currentY + 60, 280, 45);

  ctx.font = "12px monospace";
  ctx.fillStyle = "#6B7280";
  ctx.fillText(`TOKEN: ARF-${data.refNumber}-LEGAL-PRO-BONO`, barcodeX, currentY + 128);
  ctx.fillText("ISSUED UNDER ARF CIVIL JUSTICE INITIATIVE", barcodeX, currentY + 148);

  // Right: Signature
  const sigX = contentLeft + contentWidth - 280;
  ctx.fillStyle = "#0B3D2E";
  ctx.font = "italic bold 28px 'Playfair Display', Georgia, serif";
  ctx.fillText("Usman A. Usman", sigX, currentY + 80);

  ctx.strokeStyle = "#0B3D2E";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX - 10, currentY + 98);
  ctx.lineTo(sigX + 240, currentY + 98);
  ctx.stroke();

  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("Hon. Usman Aminu Usman", sigX, currentY + 120);

  ctx.fillStyle = "#6B7280";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Founder & Chief Executive Patron", sigX, currentY + 138);
  ctx.fillText("Abba Roller Foundation", sigX, currentY + 154);

  // Bottom Security Strip
  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(54, height - 90, width - 108, 36);

  ctx.fillStyle = "#D4AF37";
  ctx.font = "12px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    "ABBA ROLLER FOUNDATION LEGAL ADVOCACY DIVISION • VERIFIED PRO BONO ENROLLMENT • SECURE CITIZEN JUSTICE",
    width / 2,
    height - 67,
  );

  // Trigger Download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const safeName = data.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  link.download = `ARF-Lawyer-Slip-${safeName}-${data.refNumber}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function drawDataCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  highlight = false,
) {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = highlight ? "#0B3D2E" : "#E2E8F0";
  ctx.lineWidth = highlight ? 1.5 : 1;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#64748B";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(label.toUpperCase(), x + 16, y + 24);

  ctx.fillStyle = "#0F172A";
  ctx.font = highlight
    ? "bold 18px 'Space Grotesk', system-ui, sans-serif"
    : "600 16px system-ui, sans-serif";
  ctx.fillText(value || "—", x + 16, y + 50);
}

function drawHighlightCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
) {
  ctx.fillStyle = "#FEFCE8";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#854D0E";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText(label.toUpperCase(), x + 16, y + 24);

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 19px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText(value || "—", x + 16, y + 50);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function drawBarcodePattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = "#0F172A";
  let curX = x;
  let toggle = true;
  while (curX < x + w) {
    const barWidth = toggle ? (curX % 3 === 0 ? 3 : 2) : curX % 5 === 0 ? 4 : 2;
    if (toggle) {
      ctx.fillRect(curX, y, barWidth, h);
    }
    curX += barWidth + (curX % 4 === 0 ? 3 : 2);
    toggle = !toggle;
  }
}
