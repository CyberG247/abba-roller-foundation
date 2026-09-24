import arfLogo from "@/assets/arf-logo-official.png";
import type { Member } from "@/data/membershipStore";

/**
 * Generates an official high-resolution ARF Membership Identity Card
 * (1200 x 750 px landscape ID card format) on HTML5 canvas and triggers PNG download.
 */
export async function downloadMembershipCard(member: Member): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = 1200;
  const height = 750;
  canvas.width = width;
  canvas.height = height;

  // 1. Premium Deep Green Gradient Canvas
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#062319");
  bgGrad.addColorStop(0.5, "#0B3D2E");
  bgGrad.addColorStop(1, "#072016");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative diagonal background pattern
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 2;
  for (let i = -width; i < width * 2; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // Gold metallic border
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Top Header Banner
  const bannerGrad = ctx.createLinearGradient(0, 42, width, 42);
  bannerGrad.addColorStop(0, "#C62828");
  bannerGrad.addColorStop(1, "#E53935");
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(42, 42, width - 84, 110);

  // Header bottom gold separator
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(42, 150, width - 84, 4);

  // Draw Logo in Header
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = arfLogo;
    await new Promise((resolve) => {
      if (logoImg.complete) resolve(true);
      else {
        logoImg.onload = () => resolve(true);
        logoImg.onerror = () => resolve(false);
      }
    });

    // White circle backdrop for logo
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(105, 96, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(logoImg, 65, 56, 80, 80);
  } catch {
    // Fallback if logo fails
  }

  // Header Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ABBA ROLLER FOUNDATION", 170, 88);

  ctx.fillStyle = "#FEF08A";
  ctx.font = "600 16px sans-serif";
  ctx.fillText(
    "OFFICIAL NATIONAL MEMBERSHIP IDENTITY CARD · FEDERAL REPUBLIC OF NIGERIA",
    170,
    118,
  );

  // Membership ID Badge (Top Right)
  ctx.fillStyle = "#0B3D2E";
  ctx.beginPath();
  ctx.roundRect(width - 340, 65, 280, 60, 8);
  ctx.fill();
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("MEMBERSHIP IDENTIFICATION NO.", width - 200, 85);

  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 20px monospace";
  ctx.fillText(member.id, width - 200, 112);

  // Photo / Badge Section (Left)
  const avatarBoxX = 80;
  const avatarBoxY = 190;
  const avatarBoxW = 220;
  const avatarBoxH = 260;

  ctx.fillStyle = "#0B3D2E";
  ctx.fillRect(avatarBoxX, avatarBoxY, avatarBoxW, avatarBoxH);
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 4;
  ctx.strokeRect(avatarBoxX, avatarBoxY, avatarBoxW, avatarBoxH);

  let photoDrawn = false;
  if (member.photoUrl) {
    try {
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      userImg.src = member.photoUrl;
      await new Promise((resolve) => {
        if (userImg.complete) resolve(true);
        else {
          userImg.onload = () => resolve(true);
          userImg.onerror = () => resolve(false);
        }
      });

      if (userImg.complete && userImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(avatarBoxX + 4, avatarBoxY + 4, avatarBoxW - 8, avatarBoxH - 8);
        ctx.clip();

        // Calculate aspect fill cover
        const imgW = userImg.naturalWidth;
        const imgH = userImg.naturalHeight;
        const targetW = avatarBoxW - 8;
        const targetH = avatarBoxH - 8;
        const scale = Math.max(targetW / imgW, targetH / imgH);
        const drawnW = imgW * scale;
        const drawnH = imgH * scale;
        const offsetX = avatarBoxX + 4 + (targetW - drawnW) / 2;
        const offsetY = avatarBoxY + 4 + (targetH - drawnH) / 2;

        ctx.drawImage(userImg, offsetX, offsetY, drawnW, drawnH);
        ctx.restore();
        photoDrawn = true;
      }
    } catch {
      photoDrawn = false;
    }
  }

  // Fallback to silhouette if no photo uploaded or failed
  if (!photoDrawn) {
    ctx.fillStyle = "#092E22";
    ctx.fillRect(avatarBoxX + 4, avatarBoxY + 4, avatarBoxW - 8, avatarBoxH - 8);

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(avatarBoxX + avatarBoxW / 2, avatarBoxY + 95, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(avatarBoxX + avatarBoxW / 2, avatarBoxY + 220, 75, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MEMBER PHOTO", avatarBoxX + avatarBoxW / 2, avatarBoxY + avatarBoxH - 16);
  }

  // Tier Badge below Photo
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.roundRect(avatarBoxX, avatarBoxY + avatarBoxH + 15, avatarBoxW, 40, 6);
  ctx.fill();

  ctx.fillStyle = "#0B3D2E";
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    member.tier.toUpperCase(),
    avatarBoxX + avatarBoxW / 2,
    avatarBoxY + avatarBoxH + 41,
  );

  // Status Badge below Tier
  ctx.fillStyle = member.status === "Verified" ? "#10B981" : "#38BDF8";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(
    `● STATUS: ${member.status.toUpperCase()}`,
    avatarBoxX + avatarBoxW / 2,
    avatarBoxY + avatarBoxH + 80,
  );

  // Details Section (Center / Right)
  const infoX = 350;
  let infoY = 220;
  ctx.textAlign = "left";

  const drawField = (label: string, value: string, isBig = false) => {
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(label.toUpperCase(), infoX, infoY);

    ctx.fillStyle = isBig ? "#FACC15" : "#FFFFFF";
    ctx.font = isBig ? "bold 26px sans-serif" : "bold 18px sans-serif";
    ctx.fillText(value, infoX, infoY + (isBig ? 30 : 24));

    // Divider line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(infoX, infoY + (isBig ? 42 : 36));
    ctx.lineTo(width - 80, infoY + (isBig ? 42 : 36));
    ctx.stroke();

    infoY += isBig ? 64 : 52;
  };

  drawField("Full Member Name", member.fullName, true);
  drawField("State & Local Government Area (LGA)", `${member.lga} LGA, ${member.state} State`);
  drawField("Email Address", member.email);
  if (member.phone) {
    drawField("Phone Number / Contact", member.phone);
  }
  if (member.occupation) {
    drawField("Occupation / Specialty", member.occupation);
  }
  drawField("Date of Registration & Issue", member.joinedDate);

  // Bottom Signature & Verification Strip
  const footerY = height - 120;

  // Security Verification Stamp
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 2;
  ctx.strokeRect(width - 290, footerY - 10, 210, 70);

  ctx.fillStyle = "rgba(245, 158, 11, 0.1)";
  ctx.fillRect(width - 290, footerY - 10, 210, 70);

  ctx.fillStyle = "#F59E0B";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("ARF VERIFIED MEMBER", width - 185, footerY + 15);
  ctx.font = "bold 13px monospace";
  ctx.fillText("NATIONAL REGISTRY", width - 185, footerY + 35);
  ctx.font = "9px monospace";
  ctx.fillText("FEDERAL REPUBLIC OF NIGERIA", width - 185, footerY + 50);

  // Founder Signature
  ctx.fillStyle = "#FEF08A";
  ctx.font = "italic bold 17px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("Hon. Usman Aminu Usman", 350, footerY + 15);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "12px sans-serif";
  ctx.fillText("Founder & Chairman, Abba Roller Foundation", 350, footerY + 36);

  // Footer Disclaimer
  ctx.fillStyle = "#64748B";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "This official membership card is issued under the authority of the Abba Roller Foundation. Verified via https://arffoundation.org",
    width / 2,
    height - 44,
  );

  // Trigger browser download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `ARF_Membership_Card_${member.id}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
