import QRCode from 'qrcode-generator';
import logoImg from '../assets/icons/miniLogo.png'; // adjust if path differs

// Convert imported logo to base64
const getLogoBase64 = async () => {
  const response = await fetch(logoImg);
  const blob = await response.blob();
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generateQRCodeWithLogo = async (text, canvasSize = 200) => {
  const qr = QRCode(0, 'L');
  qr.addData(text);
  qr.make();

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  // Draw QR code
  const tileW = canvasSize / qr.getModuleCount();
  const tileH = canvasSize / qr.getModuleCount();

  for (let row = 0; row < qr.getModuleCount(); row++) {
    for (let col = 0; col < qr.getModuleCount(); col++) {
      ctx.fillStyle = qr.isDark(row, col) ? '#000000' : '#ffffff';
      ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
    }
  }

  // Embed logo in center
  const logoBase64 = await getLogoBase64();
  const img = new Image();
  img.src = logoBase64;

  return await new Promise((resolve) => {
    img.onload = () => {
      const logoSize = canvasSize * 0.2;
      const x = (canvasSize - logoSize) / 2;
      const y = (canvasSize - logoSize) / 2;
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve(canvas.toDataURL());
    };
  });
};
