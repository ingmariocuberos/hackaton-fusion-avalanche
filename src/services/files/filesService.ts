import { blobApiService } from "../../global/standardService/blobApiService";

export async function getFilesFromStorage(name: string): Promise<void> {
  try {
    const response = await blobApiService.post('/getFilesFromStorage', {
      responseType: 'blob',
      name
    });

    const url = window.URL.createObjectURL(response.data as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', response.headers['file-name-inzigne']);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    throw new Error("No se pudieron obtener los archivos");
  }
}