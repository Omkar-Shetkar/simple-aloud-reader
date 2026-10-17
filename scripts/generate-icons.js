import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPNG(size) {
  const width = size;
  const height = size;

  // Buffer for RGBA pixel data
  // Scanlines in PNG start with a 1-byte filter type (0 = None)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Gradient from indigo/blue (#4f46e5) to violet (#7c3aed)
        const t = (x + y) / (width + height);
        const r = Math.round(79 * (1 - t) + 124 * t);
        const g = Math.round(70 * (1 - t) + 58 * t);
        const b = Math.round(229 * (1 - t) + 237 * t);

        // Soundwave bars in center (white)
        // Draw 3 vertical soundwave bars in the center
        const nx = (x - cx) / (width * 0.5);
        const ny = (y - cy) / (height * 0.5);

        let isWave = false;
        // Bar 1 (left)
        if (Math.abs(nx + 0.35) < 0.08 && Math.abs(ny) < 0.35) isWave = true;
        // Bar 2 (center)
        if (Math.abs(nx) < 0.08 && Math.abs(ny) < 0.55) isWave = true;
        // Bar 3 (right)
        if (Math.abs(nx - 0.35) < 0.08 && Math.abs(ny) < 0.40) isWave = true;

        if (isWave) {
          rawData[pxOffset] = 255;     // R
          rawData[pxOffset + 1] = 255; // G
          rawData[pxOffset + 2] = 255; // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          rawData[pxOffset] = r;
          rawData[pxOffset + 1] = g;
          rawData[pxOffset + 2] = b;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside rounded icon
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  // Deflate pixel data
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to create chunk
  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    // CRC32
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // CRC32 Table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve('icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 32, 48, 96, 128].forEach((size) => {
  const png = createPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png (${size}x${size})`);
});
