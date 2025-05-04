import { useEffect, useState } from "react";
import { getAvaxPriceCOP } from "../utils/avax";

export function useAvaxPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAvaxPriceCOP()
      .then((p) => {
        if (mounted) {
          setPrice(p);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError("No se pudo obtener el precio de AVAX");
          setLoading(false);
          console.error("Error fetching AVAX price:", err);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { price, loading, error };
}
