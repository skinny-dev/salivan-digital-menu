import fs from "fs";
import path from "path";
import QRCode from "qrcode";

const DATA = "http://fastfood-salivan.ir/";
const WIDTH = 2000; // px
const OUT_DIR = path.resolve(process.cwd(), "public", "qr");
const OUT_SVG = path.join(OUT_DIR, "salivan-qr.svg");

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Generate base SVG (black modules on white)
  const baseSvg = await QRCode.toString(DATA, {
    type: "svg",
    width: WIDTH,
    errorCorrectionLevel: "Q",
    margin: 4,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // Inject a diagonal orange gradient and apply it to modules
  const gradientDef = `
    <defs>
      <linearGradient id="salivanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d73f19"/>
        <stop offset="100%" stop-color="#d77519"/>
      </linearGradient>
    </defs>
  `;

  // Insert <defs> right after the opening <svg ...>
  let svg = baseSvg.replace(/<svg[^>]*>/, (m) => `${m}\n${gradientDef}`);

  // Replace dark fills with gradient fill
  svg = svg.replace(/fill="#000"/g, 'fill="url(#salivanGrad)"');
  svg = svg.replace(/fill="#000000"/g, 'fill="url(#salivanGrad)"');

  fs.writeFileSync(OUT_SVG, svg, "utf8");
  console.log(`QR saved: ${OUT_SVG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
