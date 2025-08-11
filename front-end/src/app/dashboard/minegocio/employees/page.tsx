"use client";
import { DataSearchFilter } from "@/app/components/data-search-filter";
import { Column, DataTable } from "@/app/components/DataTable";
import { useEffect, useState } from "react";
import { Empleado } from "@/types/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getEmpleados, createEmpleados } from "@/lib/api";
import { useUser } from "@/app/components/UserContext";
import { FormEmpleadosModal } from "@/app/components/FormEmployeesModal";
export default function EmployeesPage() {
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const { session } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<Empleado[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const { data } = useQuery({
    queryKey: ["empleados"],
    queryFn: () => getEmpleados(session?.accessToken || ""),
  });

  useEffect(() => {
    console.log(data);

    if (data) {
      setEmpleados(data);
    }
  }, [data]);

  const filteredData = empleados.filter((empleado) =>
    empleado.nombre.toLowerCase().includes(searchValue.toLowerCase())
  );

  const empleadoColumns: Column<Empleado>[] = [
    {
      key: "nombre",
      label: "Nombre",
      render: (empleado) => (
        <div className="font-medium">{empleado.nombre}</div>
      ),
      sortable: true,
    },
    {
      key: "correo",
      label: "Correo",
      render: (empleado) => (
        <div className="text-sm text-muted-foreground line-clamp-1">
          {empleado.correo}
        </div>
      ),
      sortable: true,
    },
    {
      key: "password",
      label: "Contraseña",
      render: () => (
        <div className="text-sm text-muted-foreground italic">••••••••</div>
      ),
      sortable: false,
    },
    {
      key: "negocio",
      label: "ID Negocio",
      render: (empleado) => (
        <span className="font-medium">{empleado.negocio}</span>
      ),
      sortable: true,
    },
    {
      key: "salario",
      label: "Salario",
      render: (empleado) => (
        <span className="font-medium">
          {empleado.salario.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </span>
      ),
      sortable: true,
    },
  ];

  const useCreateEmpleado = useMutation({
    mutationFn: (data: Empleado) =>
      createEmpleados(data, session?.accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function handleSubmit(
    data: Omit<Empleado, "negocio">,
    id?: string | undefined
  ): Promise<void> {
    useCreateEmpleado.mutate({
      ...data,
      negocio: session?.user.negocio || 0,
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Dashboard de Mi Negocio
      </h1>
      <p className="text-muted-foreground mt-2 mb-2">
        Controla los empleados de tu negocio
      </p>

      <DataSearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={[]}
        activeFilters={{}}
        onFilterChange={() => {}}
        onClearFilters={() => {}}
        showAdvancedFilters={false}
        onToggleAdvancedFilters={() => {}}
        selectedItems={selectedItems}
        onShowCreateModal={setShowCreateModal}
        showCreateModal={true}
      />

      <div className="mt-8">
        <DataTable
          data={filteredData}
          columns={empleadoColumns}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          emptyMessage={"No hay empleados disponibles"}
          emptyDescription={"El negocio no tiene empleados"}
        />
      </div>

      {showCreateModal && (
        <FormEmpleadosModal
          onClose={() => setShowCreateModal(false)}
          isOpen={showCreateModal}
          mode="create"
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
