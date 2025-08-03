"use client";

import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaFormSchema, FacturaFormData } from "@/types/types";
import { useSimularFactura } from "@/hooks/useFactura";
import { FacturaProductos } from "./FacturaProductos";
import { FacturaClienteSelector } from "./FacturaClienteSelector";
import { Client } from "@/types/types";
import { useEffect, useState } from "react";
export default function FacturaForm() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const form = useForm<FacturaFormData>({
    resolver: zodResolver(facturaFormSchema),
    defaultValues: {
      clienteId: 0,
      productos: [],
    },
  });

  useEffect(() => {
    if (selectedClient) {
      form.setValue("clienteId", Number(selectedClient.id));
    } else {
      form.setValue("clienteId", 0);
    }
  }, [selectedClient, form]);

  const { mutate: simular, isPending: isLoading } = useSimularFactura();

  const onSubmit = async (data: FacturaFormData) => {
    simular(data);
    form.reset();
  };

  return (
    <FormProvider {...form}>
      <form
        //debug errors from react-hook-form
        onSubmit={form.handleSubmit(onSubmit)}
        onError={(error) => console.log(error)}
        className="space-y-6 max-w-3xl mx-auto p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Simular Factura</h1>
        <FacturaClienteSelector
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
        <FacturaProductos />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Simulando..." : "Simular factura"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
