"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesFromStorage = void 0;
const https_1 = require("firebase-functions/v2/https");
const storage_1 = require("firebase-admin/storage");
const filesConstants_1 = require("../constants/filesConstants");
exports.getFilesFromStorage = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { name } = req.query;
        const fileRoute = filesConstants_1.files.find((file) => file.name === name);
        if (!fileRoute) {
            res.status(404).send('Referencia de archivo no encontrada');
            return;
        }
        const bucket = (0, storage_1.getStorage)().bucket();
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
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
        return;
    }
});
//# sourceMappingURL=getFilesFromStorage.js.map