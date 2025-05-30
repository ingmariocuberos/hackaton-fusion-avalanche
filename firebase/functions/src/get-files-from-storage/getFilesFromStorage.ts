import { onRequest } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";
import { files } from "../constants/filesConstants";

export const getFilesFromStorage = onRequest(async (req, res) => {
  try {
    const { name } = req.query;
    const fileRoute = files.find((file) => file.name === name);
    if (!fileRoute) {
      res.status(404).send('Referencia de archivo no encontrada');
      return;
    }
    
    const bucket = getStorage().bucket();
    const file = bucket.file(fileRoute.path);

    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).send('Archivo no encontrado');
      return;
    }

    const readStream = file.createReadStream();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileRoute.name}.pdf"`);

    readStream.pipe(res);
    return;
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error", details: err.message });
    return;
  }
}); 