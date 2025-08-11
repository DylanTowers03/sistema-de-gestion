"use client";

import { useUser } from "@/app/components/UserContext";
import React from "react";
import { FormMinegocio } from "@/app/components/MiNegocioForm";
import { getMiNegocio } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
export default function EditNegocioPage() {
  const { session } = useUser();

  const { data } = useQuery({
    queryKey: ["minegocio"],
    queryFn: () => getMiNegocio(session?.accessToken || ""),
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Dashboard de Mi Negocio
      </h1>
      <p className="text-muted-foreground mt-2">
        Controla los datos de tu negocio
      </p>

      <div className="mt-8">
        <FormMinegocio negocio={data} />
      </div>

      {/* Aquí puedes agregar más contenido relacionado con Mi Negocio */}
    </div>
  );
}
