import arfLogo from "@/assets/arf-logo-official.png";

export interface VolunteerSlipData {
  refNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  ageGroup: string;
  state: string;
  lga: string;
  address?: string;
  profession: string;
  activity: string;
  secondaryActivities?: string[];
  availability: string;
  photoUrl?: string | null;
  submissionDate: string;
}

/**
 * Renders an ultra-high resolution official ARF Volunteer Acknowledgement Slip
 * directly to an HTML5 canvas and triggers an instant PNG download.
 */
export async function downloadVolunteerSlip(data: VolunteerSlipData): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // High-DPI dimensions (2x scale for 600x800 logical, canvas 1200x1600)
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  // Background - Clean Parchment / Off-white
  ctx.fillStyle = "#FAFBF9";
  ctx.fillRect(0, 0, width, height);

  // Outer Border & Guilloche Frame
  ctx.strokeStyle = "#0B3D2E";
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = "#C62828";
  ctx.lineWidth = 3;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Top Header Banner
  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(52, 52, width - 104, 210);

  // Decorative gold/red accent line
  ctx.fillStyle = "#C62828";
  ctx.fillRect(52, 260, width - 104, 8);

  // Load Logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = arfLogo;
    await new Promise((resolve) => {
      if (logoImg.complete) resolve(true);
      logoImg.onload = () => resolve(true);
      logoImg.onerror = () => resolve(false);
    });

    // Draw circular logo with shadow/border
    ctx.save();
    ctx.beginPath();
    ctx.arc(160, 155, 68, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.clip();
    ctx.drawImage(logoImg, 92, 87, 136, 136);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(160, 155, 68, 0, Math.PI * 2, true);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.stroke();
  } catch (e) {
    console.error("Logo load error:", e);
  }

  // Header Texts
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px 'DM Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ABBA ROLLER FOUNDATION", 260, 125);

  ctx.fillStyle = "#A3E635";
  ctx.font = "600 18px 'Manrope', sans-serif";
  ctx.fillText("DIRECTORATE OF VOLUNTEER SERVICES & FIELD MISSIONS", 260, 160);

  ctx.fillStyle = "#E5E7EB";
  ctx.font = "italic 16px 'Manrope', sans-serif";
  ctx.fillText("Empowering youth & women. Strengthening communities across Nigeria.", 260, 195);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px 'Manrope', sans-serif";
  ctx.fillText("OFFICIAL HUMANITARIAN INTAKE REGISTRY", 260, 228);

  // Document Title Banner
  ctx.fillStyle = "#F3F4F6";
  ctx.fillRect(70, 290, width - 140, 75);
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 290, width - 140, 75);

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 26px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VOLUNTEER APPLICATION ACKNOWLEDGEMENT SLIP", width / 2, 335);

  // Reference Code & Date Strip
  ctx.fillStyle = "#111827";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`REGISTRATION REF: ${data.refNumber}`, 80, 405);

  ctx.fillStyle = "#4B5563";
  ctx.font = "16px 'Manrope', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`SUBMITTED ON: ${data.submissionDate}`, width - 80, 405);

  // Status Badge
  ctx.fillStyle = "#DCFCE7";
  ctx.fillRect(80, 425, 340, 38);
  ctx.strokeStyle = "#16A34A";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, 425, 340, 38);

  ctx.fillStyle = "#166534";
  ctx.font = "bold 14px 'Manrope', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("✓ STATUS: APPLICATION RECEIVED & LOGGED", 95, 450);

  // Watermark Crest in background
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#0B3D2E";
  ctx.beginPath();
  ctx.arc(width / 2, 850, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Load and Draw Applicant Passport Photo (Right column)
  const photoX = width - 360;
  const photoY = 485;
  const photoW = 260;
  const photoH = 310;

  // Photo frame background & border
  ctx.fillStyle = "#E5E7EB";
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.strokeStyle = "#0B3D2E";
  ctx.lineWidth = 4;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  let photoDrawn = false;
  if (data.photoUrl) {
    try {
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = data.photoUrl;
      await new Promise((resolve) => {
        if (userImg.complete) resolve(true);
        userImg.onload = () => resolve(true);
        userImg.onerror = () => resolve(false);
      });
      ctx.drawImage(userImg, photoX, photoY, photoW, photoH);
      photoDrawn = true;
    } catch (e) {
      console.error("User photo load error:", e);
    }
  }

  if (!photoDrawn) {
    // Draw placeholder avatar silhouette
    ctx.fillStyle = "#D1D5DB";
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = "#9CA3AF";
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + 110, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + 280, 110, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4B5563";
    ctx.font = "bold 16px 'Manrope', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("APPLICANT PHOTO", photoX + photoW / 2, photoY + 190);
  }

  // Photo Seal / Ribbon
  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(photoX, photoY + photoH - 32, photoW, 32);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px 'Manrope', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VERIFIED VOLUNTEER APPLICANT", photoX + photoW / 2, photoY + photoH - 11);

  // Applicant Information Fields (Left side)
  const leftX = 80;
  let currY = 510;
  const labelWidth = 240;

  const drawField = (label: string, value: string, isHighlight = false) => {
    // Field background card
    ctx.fillStyle = isHighlight ? "#F0FDF4" : "#FFFFFF";
    ctx.fillRect(leftX, currY - 26, 460, 48);
    ctx.strokeStyle = isHighlight ? "#86EFAC" : "#E5E7EB";
    ctx.lineWidth = 1;
    ctx.strokeRect(leftX, currY - 26, 460, 48);

    ctx.fillStyle = "#6B7280";
    ctx.font = "bold 14px 'Manrope', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label.toUpperCase(), leftX + 16, currY - 6);

    ctx.fillStyle = isHighlight ? "#0B3D2E" : "#111827";
    ctx.font = isHighlight ? "bold 18px 'DM Sans', sans-serif" : "600 17px 'DM Sans', sans-serif";

    // Text truncation if too long
    let displayValue = value || "—";
    if (displayValue.length > 36) {
      displayValue = displayValue.slice(0, 33) + "...";
    }
    ctx.fillText(displayValue, leftX + 16, currY + 14);

    currY += 58;
  };

  drawField("Full Name", data.fullName, true);
  drawField("Profession / Occupation", data.profession, true);
  drawField("Phone / WhatsApp Number", data.phone);
  drawField("Email Address", data.email);
  drawField("State & LGA of Residence", `${data.lga}, ${data.state} State`);
  drawField("Gender & Age Bracket", `${data.gender} (${data.ageGroup})`);

  // Volunteering Deployment Details Section
  currY = Math.max(currY + 15, 870);

  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(leftX, currY, width - 160, 42);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 17px 'DM Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("SELECTED PHILANTHROPIC INVOLVEMENT & MISSION DETAILS", leftX + 20, currY + 27);

  currY += 56;

  // Selected Philanthropic Activity Box
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(leftX, currY, width - 160, 110);
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(leftX, currY, width - 160, 110);

  ctx.fillStyle = "#6B7280";
  ctx.font = "bold 13px 'Manrope', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PRIMARY PHILANTHROPIC VOLUNTEERING ACTIVITY / OUTREACH:", leftX + 24, currY + 30);

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 20px 'DM Sans', sans-serif";
  ctx.fillText(data.activity, leftX + 24, currY + 62);

  ctx.fillStyle = "#4B5563";
  ctx.font = "15px 'Manrope', sans-serif";
  ctx.fillText(`Availability Commitment: ${data.availability}`, leftX + 24, currY + 92);

  currY += 135;

  // Secondary interests if provided
  if (data.secondaryActivities && data.secondaryActivities.length > 0) {
    ctx.fillStyle = "#F9FAFB";
    ctx.fillRect(leftX, currY, width - 160, 50);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    ctx.strokeRect(leftX, currY, width - 160, 50);

    ctx.fillStyle = "#374151";
    ctx.font = "14px 'Manrope', sans-serif";
    ctx.fillText(
      `Secondary Service Interests: ${data.secondaryActivities.join(", ")}`,
      leftX + 20,
      currY + 31,
    );
    currY += 66;
  }

  // Official Endorsement and Verification Section
  currY = Math.max(currY + 15, 1170);

  // Left Signatory: Founder & Chairman
  ctx.strokeStyle = "#9CA3AF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftX + 40, currY + 80);
  ctx.lineTo(leftX + 340, currY + 80);
  ctx.stroke();

  // Signature script emulation
  ctx.fillStyle = "#0B3D2E";
  ctx.font = "italic bold 28px 'DM Sans', serif";
  ctx.textAlign = "center";
  ctx.fillText("Usman Aminu Usman", leftX + 190, currY + 65);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px 'DM Sans', sans-serif";
  ctx.fillText("Hon. Usman Aminu Usman (Abba Roller)", leftX + 190, currY + 105);

  ctx.fillStyle = "#6B7280";
  ctx.font = "13px 'Manrope', sans-serif";
  ctx.fillText("Founder & Chairman, Abba Roller Foundation", leftX + 190, currY + 125);

  // Center Official Seal Graphic
  const sealX = width / 2;
  const sealY = currY + 70;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
  ctx.fillStyle = "#FEF3C7";
  ctx.fill();
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#92400E";
  ctx.font = "bold 11px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("OFFICIAL SEAL", sealX, sealY - 14);
  ctx.fillText("★ ARF NIGERIA ★", sealX, sealY + 2);
  ctx.fillText("VERIFIED 2026", sealX, sealY + 18);

  // Right Signatory: Volunteer Directorate
  const rightSignX = width - 80 - 190;
  ctx.strokeStyle = "#9CA3AF";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - 80 - 340, currY + 80);
  ctx.lineTo(width - 80 - 40, currY + 80);
  ctx.stroke();

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "italic bold 24px 'DM Sans', serif";
  ctx.textAlign = "center";
  ctx.fillText("ARF Directorate Registry", rightSignX, currY + 65);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px 'DM Sans', sans-serif";
  ctx.fillText("Volunteer Services & Field Intake", rightSignX, currY + 105);

  ctx.fillStyle = "#6B7280";
  ctx.font = "13px 'Manrope', sans-serif";
  ctx.fillText("Central Operations Command", rightSignX, currY + 125);

  // Simulated QR Code Block at bottom right
  const qrX = width - 180;
  const qrY = height - 200;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(qrX - 10, qrY - 10, 100, 100);
  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 1;
  ctx.strokeRect(qrX - 10, qrY - 10, 100, 100);

  // QR grid representation
  ctx.fillStyle = "#0B3D2E";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if ((r + c) % 2 === 0 || (r === 0 && c === 0) || (r === 6 && c === 6)) {
        ctx.fillRect(qrX + c * 11 + 2, qrY + r * 11 + 2, 8, 8);
      }
    }
  }

  // Footer Instructions & Notice
  ctx.fillStyle = "#F3F4F6";
  ctx.fillRect(52, height - 120, width - 104, 68);
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  ctx.strokeRect(52, height - 120, width - 104, 68);

  ctx.fillStyle = "#374151";
  ctx.font = "12px 'Manrope', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    "IMPORTANT NOTICE: This acknowledgement slip confirms your volunteer application has been logged into the Abba Roller Foundation Registry.",
    75,
    height - 90,
  );
  ctx.fillText(
    "The Volunteer Services Directorate will reach out via WhatsApp/Phone for field deployment briefing and outreach accreditation.",
    75,
    height - 70,
  );

  // Trigger download
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ARF-Volunteer-Slip-${data.refNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
