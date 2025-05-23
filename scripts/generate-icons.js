const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const sizes = [192, 512];
const sourceIcon = path.join(__dirname, "../src/assets/logo.png");
const outputDir = path.join(__dirname, "../public");

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generar íconos para cada tamaño
async function generateIcons() {
  try {
    const image = await Jimp.read(sourceIcon);
    
    for (const size of sizes) {
      const resizedImage = image.clone().resize(size, size);
      await resizedImage.writeAsync(path.join(outputDir, `logo${size}.png`));
      console.log(`Generated logo${size}.png`);
    }
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
