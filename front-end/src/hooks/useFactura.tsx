// lib/hooks/useSimularFactura.ts
import { useMutation } from "@tanstack/react-query";
import { crearFactura } from "@/lib/api"; // debe existir
import toast from "react-hot-toast";
import { FacturaFormData } from "@/types/types";
import { useUser } from "@/app/components/UserContext";
import { generarFacturaPDF } from "./generarFactura";
export function useSimularFactura(onSuccess?: () => void) {
  const { session } = useUser();

  return useMutation({
    mutationFn: (data: FacturaFormData) =>
      crearFactura(data, session?.accessToken || ""),
    onSuccess: (data) => {
      toast.success("Factura simulada correctamente");
      generarFacturaPDF(data.factura);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.log(error);

      toast.error("Error al simular factura");
    },
  });
}
