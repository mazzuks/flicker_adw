const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Caminho absoluto para a pasta public do projeto
const publicDir = '/home/dan/dev/adworks_flicker/public';

async function generateIcons() {
  const svgBuffer = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="128" fill="#0047FF"/>
      <text x="50%" y="55%" font-family="Arial" font-weight="900" font-size="300" fill="white" text-anchor="middle" dominant-baseline="middle">A</text>
    </svg>
  `);

  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    console.log('✅ Ícones do PWA gerados em /public');
  } catch (err) {
    console.error('Erro ao gerar ícones:', err);
  }
}

generateIcons();
