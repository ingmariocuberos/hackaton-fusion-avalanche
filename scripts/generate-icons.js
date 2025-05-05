const sharp = require("sharp");
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
sizes.forEach((size) => {
  sharp(sourceIcon)
    .resize(size, size)
    .toFile(path.join(outputDir, `logo${size}.png`))
    .then(() => {
      console.log(`Generated logo${size}.png`);
    })
    .catch((err) => {
      console.error(`Error generating logo${size}.png:`, err);
    });
});
