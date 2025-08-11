"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { negocioStats } from "@/lib/constants";
import { motion } from "motion/react";
import { DataSearchFilter } from "@/app/components/data-search-filter";
import { Column, DataTable } from "@/app/components/DataTable";
import { useEffect, useMemo, useState } from "react";
import { NegocioSuperAdmin } from "@/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuperAdminNegocios } from "@/lib/api";
import { useUser } from "@/app/components/UserContext";

export default function NegociosPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<NegocioSuperAdmin[]>([]);
  const [negocios, setNegocios] = useState<NegocioSuperAdmin[]>([]);
  const { session } = useUser();

  const { data } = useQuery({
    queryKey: ["negociosSuperAdmin"],
    queryFn: () => getSuperAdminNegocios(session?.accessToken || ""),
  });

  useEffect(() => {
    if (data) {
      setNegocios(data);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    console.log("negocios", negocios);

    return negocios.filter((negocio) =>
      negocio.nombreNegocio.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [negocios, searchValue]);

  const negocioSuperAdminColumns: Column<NegocioSuperAdmin>[] = [
    {
      key: "nombreNegocio",
      label: "Nombre del Negocio",
      render: (negocio) => (
        <div className="font-medium">{negocio.nombreNegocio}</div>
      ),
      sortable: true,
    },
    {
      key: "propietario",
      label: "Propietario",
      render: (negocio) => (
        <div>
          <div className="font-medium">{negocio.propietario?.nombre}</div>
          <div className="text-sm text-muted-foreground">
            {negocio.propietario?.correo}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "direccion",
      label: "Dirección",
      render: (negocio) => (
        <div className="text-sm text-muted-foreground">{negocio.direccion}</div>
      ),
      sortable: true,
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (negocio) => <span>{negocio.telefono}</span>,
      sortable: true,
    },
    {
      key: "correo",
      label: "Correo",
      render: (negocio) => (
        <div className="text-sm text-muted-foreground">{negocio.correo}</div>
      ),
      sortable: true,
    },
    {
      key: "tipoNegocio",
      label: "Tipo de Negocio",
      render: (negocio) => (
        <div>
          <div className="font-medium">{negocio.tipoNegocio?.nombre}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "fechaCreacion",
      label: "Fecha de Creación",
      render: (negocio) =>
        negocio.fechaCreacion ? (
          <span>
            {new Date(negocio.fechaCreacion).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        ) : (
          <span className="italic text-muted-foreground">Sin fecha</span>
        ),
      sortable: true,
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion de Negocios
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra y controla todos los negocios de tu plataforma
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Negocios Activos
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-3">
          {negocioStats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> desde el
                  mes pasado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <DataSearchFilter
          showCreateModal={false}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilters={{}}
          onFilterChange={() => {}}
          onClearFilters={() => {}}
          showAdvancedFilters={false}
          onToggleAdvancedFilters={() => {}}
          selectedItems={selectedItems}
        />
        <div className="mt-8">
          <DataTable
            selectedItems={selectedItems}
            data={filteredData}
            columns={negocioSuperAdminColumns}
            emptyDescription="No se encontraron negocios para mostrar"
            emptyMessage="No hay negocios disponibles"
            onSelectionChange={setSelectedItems}
          />
        </div>
      </motion.div>
    </>
  );
}
