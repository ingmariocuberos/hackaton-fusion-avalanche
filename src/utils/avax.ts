import { apiService } from '../global/standardService/apiService';

export async function getAvaxPriceCOP(): Promise<number> {
  try {
    const data = await apiService.get<{ price: number }>('/avax-cop');
    return data?.price ?? 0;
  } catch (error) {
    throw new Error("No se pudo obtener el precio de AVAX");
  }
}
