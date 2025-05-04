export async function getAvaxPriceCOP(): Promise<number> {
  const res = await fetch("http://localhost:4000/api/avax-cop");
  if (!res.ok) throw new Error("No se pudo obtener el precio de AVAX");
  const data = await res.json();
  return data?.price ?? 0;
}
