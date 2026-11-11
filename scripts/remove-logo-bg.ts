import sharp from 'sharp';
import path from 'path';

async function removeBackgroundAndTrim() {
  const inputPath = path.join(__dirname, '../public/images/pa3-3d-logo.jpg');
  const outputPath = path.join(__dirname, '../public/images/pa3-3d-logo.png');

  const img = sharp(inputPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const outBuf = Buffer.alloc(width * height * 4);

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * info.channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const maxV = Math.max(r, g, b);
      const minV = Math.min(r, g, b);
      const diff = maxV - minV;

      let alpha = 255;

      // Checkerboard tiles:
      // Dark tile: ~0..25, diff <= 8
      // Light tile: ~40..66, diff <= 14
      if ((maxV <= 68 && diff <= 14) || (maxV <= 78 && diff <= 8)) {
        alpha = 0;
      } else if (maxV <= 88 && diff <= 10) {
        // Soft edge
        alpha = Math.round(((maxV - 68) / 20) * 255);
      } else {
        alpha = 255;
      }

      outBuf[dstIdx] = r;
      outBuf[dstIdx + 1] = g;
      outBuf[dstIdx + 2] = b;
      outBuf[dstIdx + 3] = alpha;

      if (alpha > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 6px clean margin
  minX = Math.max(0, minX - 6);
  minY = Math.max(0, minY - 6);
  maxX = Math.min(width - 1, maxX + 6);
  maxY = Math.min(height - 1, maxY + 6);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  console.log(`Logo bounds with clean background removed: (${minX}, ${minY}) ${cropW}x${cropH}`);

  const croppedBuf = Buffer.alloc(cropW * cropH * 4);
  for (let cy = 0; cy < cropH; cy++) {
    const srcY = minY + cy;
    for (let cx = 0; cx < cropW; cx++) {
      const srcX = minX + cx;
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (cy * cropW + cx) * 4;

      croppedBuf[dstIdx] = outBuf[srcIdx];
      croppedBuf[dstIdx + 1] = outBuf[srcIdx + 1];
      croppedBuf[dstIdx + 2] = outBuf[srcIdx + 2];
      croppedBuf[dstIdx + 3] = outBuf[srcIdx + 3];
    }
  }

  await sharp(croppedBuf, {
    raw: {
      width: cropW,
      height: cropH,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  console.log(`Saved transparent trimmed PNG (${cropW}x${cropH}) to ${outputPath}`);
}

removeBackgroundAndTrim().catch(console.error);
