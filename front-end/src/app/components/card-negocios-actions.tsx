"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  cardVariants,
  containerVariants,
  getColorClasses,
  getBadgeColorClasses,
  getIconColorClasses,
  returnErrorMessage,
} from "@/lib/constants";
import {
  AnonymousAction,
  Negocio,
  NegociosFormData,
  TipoNegocioFormData,
} from "@/types/types";
import { motion } from "motion/react";
import { FormNegociosModal } from "@/app/components/form-negocios-modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNegocio,
  createTipoNegocio,
  deleteNegocio,
  getUsuarioNegocio,
  updateNegocio,
} from "@/lib/api";
import { useUser } from "./UserContext";
import { DeleteModal } from "./delete-modal";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ModalTable } from "./ModalTable";
import { Column } from "./DataTable";
import { FormModalTipoNegocio } from "./form-tipo-negocio";
export default function CardsNegociosActions({
  title,
  description,
  actions,
}: AnonymousAction) {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isTiposModalOpen, setIsTiposModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "update">(
    "create"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { session } = useUser();
  const [isAllOpen, setIsAllOpen] = React.useState(false);
  const [queryData, setQueryData] = React.useState<Negocio[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<Negocio[]>([]);
  const { data, error } = useQuery({
    queryKey: ["negocios"],
    queryFn: () =>
      getUsuarioNegocio(session?.accessToken || "", session?.user.id || 0),
  });

  React.useEffect(() => {
    if (data) {
      setQueryData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (error as AxiosError) {
      if ((error as AxiosError).response?.status === 401) {
        toast.error("Sesión expirada, por favor inicia sesión nuevamente.");
      }
    }
  }, [error]);

  const createNegocioMutation = useMutation({
    mutationFn: (data: NegociosFormData) =>
      createNegocio(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["negocios"],
      });
      toast.success("Negocio creado exitosamente");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  const updateNegocioMutation = useMutation({
    mutationFn: (data: Negocio) =>
      updateNegocio(
        {
          ...data,
        },
        session?.accessToken || ""
      ),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["negocios"],
      });
      toast.success("Negocio actualizado exitosamente");
    },
    onError: (error: AxiosError) => {
      console.error("Error al actualizar negocio:", error);
      returnErrorMessage(error);
    },
  });

  const deleteNegocioMutation = useMutation({
    mutationFn: (id: string) => deleteNegocio(id, session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["negocios"],
      });
      toast.success("Negocio eliminado exitosamente");
    },
    onError: (error: AxiosError) => {
      console.error("Error al eliminar negocio:", error);
      returnErrorMessage(error);
    },
  });

  const handleActionClick = (action: string) => {
    switch (action) {
      case "create":
        setModalMode("create");
        setIsFormModalOpen(true);
        break;
      case "update":
        setModalMode("update");
        setIsFormModalOpen(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true);
        break;
      case "create-type":
        setModalMode("create");
        setIsTiposModalOpen(true);
        break;
      case "view":
        setIsAllOpen(true);
        break;
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleteModalOpen(false);
    deleteNegocioMutation.mutate(id);
  };

  async function handleFormSubmit(
    data: NegociosFormData,
    id?: string | undefined
  ) {
    if (modalMode === "create") {
      console.log("Creating negocio with data:", data);

      createNegocioMutation.mutate(data);
    }
    if (modalMode === "update") {
      updateNegocioMutation.mutate({
        ...data,
        id: id || "",
      });
      console.log("Updating negocio with data:", data, "and id:", id);
    }
  }

  const createTiposMutation = useMutation({
    mutationFn: (data: TipoNegocioFormData) =>
      createTipoNegocio(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsTiposModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["tiposNegocio"],
      });
      toast.success("Tipo de negocio creado exitosamente");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  async function handleTiposFormSubmit(
    data: TipoNegocioFormData, // Replace with actual type if available
    id?: string | undefined
  ) {
    if (modalMode === "create") {
      console.log("Creating tipo negocio with data:", data);
      // Call the create function here
      createTiposMutation.mutate(data);
    }
    if (modalMode === "update") {
      console.log("Updating tipo negocio with data:", data, "and id:", id);
      // Call the update function here
    }
  }

  const filteredData = React.useMemo(() => {
    if (searchValue) {
      return queryData.filter(
        (item) =>
          item.nombreNegocio
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.direccion.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.telefono.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.correo.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return queryData;
  }, [queryData, searchValue]);

  const negocioColumns: Column<Negocio>[] = [
    {
      key: "nombreNegocio",
      label: "Nombre del Negocio",
      render: (negocio) => (
        <div className="font-medium">{negocio.nombreNegocio}</div>
      ),
      sortable: true,
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      render: (negocio) => (
        <div className="text-sm text-muted-foreground line-clamp-1">
          {negocio.correo}
        </div>
      ),
      sortable: true,
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (negocio) => (
        <span className="font-medium">{negocio.telefono}</span>
      ),
      sortable: true,
    },
    {
      key: "direccion",
      label: "Dirección",
      render: (negocio) => (
        <div className="text-sm text-muted-foreground line-clamp-1">
          {negocio.direccion}
        </div>
      ),
      sortable: false,
      width: "w-64",
    },
  ];

  return (
    <>
      <Card className="border-0 shadow-sm mt-4 mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Acciones de {title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      <CardContent>
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {actions.map((action) => (
            <motion.div key={action.action} variants={cardVariants}>
              <Card
                onClick={() => handleActionClick(action.action)}
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer group ${getColorClasses(
                  action.color
                )}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-background border group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon
                          className={`h-5 w-5 ${getIconColorClasses(
                            action.color
                          )}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {action.title}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <action.permissionIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Permisos:
                      </span>
                      <Badge
                        variant="outline"
                        className={getBadgeColorClasses(action.color)}
                      >
                        {action.permissions}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
      <FormNegociosModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={modalMode}
        onSubmit={handleFormSubmit}
      />

      <FormModalTipoNegocio
        isOpen={isTiposModalOpen}
        onClose={() => setIsTiposModalOpen(false)}
        mode={modalMode}
        onSubmit={handleTiposFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        section="negocios"
        onDelete={handleDelete}
      />

      <ModalTable
        isOpen={isAllOpen}
        onClose={() => setIsAllOpen(false)}
        section="negocios"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filteredData={filteredData}
        columns={negocioColumns}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
      />
    </>
  );
}
