const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "C:/Users/paola/OneDrive/Imágenes/imagenes/Screenshot_3.png";
const OUT_DIR = path.join(__dirname, "assets", "chiikawa", "faces");

const COLS = 4;
const ROWS = 2;
const BG = { r: 186, g: 186, b: 186 };
const THRESHOLD = 18;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const image = sharp(SRC).ensureAlpha();
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Chroma-key: vuelve transparente todo pixel parecido al gris de fondo.
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isBg =
      Math.abs(r - BG.r) <= THRESHOLD &&
      Math.abs(g - BG.g) <= THRESHOLD &&
      Math.abs(b - BG.b) <= THRESHOLD;
    if (isBg) {
      data[i + 3] = 0;
    }
  }

  const transparentBuffer = await sharp(data, {
    raw: { width, height, channels },
  })
    .png()
    .toBuffer();

  const cellW = width / COLS;
  const cellH = height / ROWS;

  let index = 1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const centerX = (col + 0.42) * cellW;
      const centerY = (row + 0.5) * cellH;
      const halfW = cellW * 0.34;
      const halfH = cellH * 0.46;

      const left = Math.max(0, Math.round(centerX - halfW));
      const right = Math.min(width, Math.round(centerX + halfW));
      const top = Math.max(0, Math.round(centerY - halfH));
      const bottom = Math.min(height, Math.round(centerY + halfH));
      const w = right - left;
      const h = bottom - top;

      const outPath = path.join(OUT_DIR, `face-${index}.png`);
      const cropped = sharp(transparentBuffer).extract({
        left,
        top,
        width: w,
        height: h,
      });

      try {
        await cropped.clone().trim({ threshold: 10 }).toFile(outPath);
      } catch (err) {
        console.warn(`Trim falló en face-${index}, usando recorte simple.`);
        await cropped.clone().toFile(outPath);
      }

      console.log(`Guardado ${outPath}`);
      index++;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
