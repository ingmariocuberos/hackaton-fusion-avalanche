import CryptoJS from "crypto-js";

export const encryptionHelper = {
  /**
   * Encripta un objeto o string usando AES
   * @param data - Los datos a encriptar
   * @param localId - El ID del usuario que se usará como llave de encriptación
   * @returns string - Los datos encriptados en formato string
   */
  encrypt: (data: any, localId: string): string => {
    try {
      const dataString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(dataString, localId).toString();
    } catch (error) {
      console.error("Error al encriptar datos:", error);
      throw new Error("Error al encriptar los datos");
    }
  },

  /**
   * Desencripta un string encriptado
   * @param encryptedData - Los datos encriptados
   * @param localId - El ID del usuario que se usó como llave de encriptación
   * @returns any - Los datos desencriptados
   */
  decrypt: (encryptedData: string, localId: string): any => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, localId);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error al desencriptar datos:", error);
      throw new Error("Error al desencriptar los datos");
    }
  },
};
