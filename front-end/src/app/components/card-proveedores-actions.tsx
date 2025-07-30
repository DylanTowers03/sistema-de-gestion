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
  Product,
  Proveedor,
  ProveedoresFormData,
} from "@/types/types";
import { motion } from "motion/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProveedor,
  deleteProveedor,
  getProducts,
  getProveedores,
  updateProveedor,
} from "@/lib/api";
import { useUser } from "./UserContext";
import { DeleteModal } from "./delete-modal";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ModalTable } from "./ModalTable";
import { Column } from "./DataTable";
import { FormProveedoresModal } from "./form-proveedores.modal";
import { SelectMultipleModal } from "./SelectMultipleModal";
import { Check } from "lucide-react";
import { assingProveedorToProducto } from "@/lib/api";

export default function CardsProveedoresActions({
  title,
  description,
  actions,
}: AnonymousAction) {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "update">(
    "create"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { session } = useUser();
  const [isAllOpen, setIsAllOpen] = React.useState(false);
  const [queryData, setQueryData] = React.useState<Proveedor[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<Proveedor[]>([]);
  const [productos, setProductos] = React.useState<Product[]>([]);
  const [isSelectMultipleModalOpen, setIsSelectMultipleModalOpen] =
    React.useState(false);

  const { data, error } = useQuery({
    queryKey: ["proveedores"],
    queryFn: () => getProveedores(session?.accessToken || ""),
  });

  const { data: productosData } = useQuery({
    queryKey: ["productos"],
    queryFn: () => getProducts(session?.accessToken || ""),
  });

  React.useEffect(() => {
    if (productosData) {
      setProductos(productosData);
    }
  }, [productosData]);

  React.useEffect(() => {
    if (data) {
      setQueryData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (error as AxiosError) {
      if ((error as AxiosError).response?.status === 401) {
        toast.error("Session expired, please login again.");
      }
    }
  }, [error]);

  const createProveedorMutation = useMutation({
    mutationFn: (data: ProveedoresFormData) =>
      createProveedor(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["proveedores"],
      });
      toast.success("Proveedor created successfully");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  const updateProveedorMutation = useMutation({
    mutationFn: (data: Partial<Proveedor>) =>
      updateProveedor(
        {
          ...data,
        },
        session?.accessToken || ""
      ),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["proveedores"],
      });
      toast.success("Proveedor updated successfully");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  const deleteProveedorMutation = useMutation({
    mutationFn: (id: string) => deleteProveedor(id, session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["proveedores"],
      });
      toast.success("Proveedor deleted successfully");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  const assignProveedorToProductoMutation = useMutation({
    mutationFn: (data: { proveedorId: number; productoId: number[] }) =>
      assingProveedorToProducto(
        data.productoId,
        data.proveedorId,
        session?.accessToken || ""
      ),
    onSuccess: () => {
      toast.success("Proveedor assigned to product successfully");
    },
    onError: (error: AxiosError) => {
      console.log(error);
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
        //some delete logic here
        setIsDeleteModalOpen(true);
        break;
      case "view":
        setIsAllOpen(true);
        break;
      case "assign-products":
        setIsSelectMultipleModalOpen(true);
        break;
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleteModalOpen(false);
    deleteProveedorMutation.mutate(id);
  };

  async function handleFormSubmit(
    data: ProveedoresFormData,
    id?: string | undefined
  ) {
    if (modalMode === "create") {
      createProveedorMutation.mutate(data);
    }
    if (modalMode === "update") {
      updateProveedorMutation.mutate({
        ...data,
        id: id || "",
      });
    }
  }

  const filteredData = React.useMemo(() => {
    if (searchValue) {
      return queryData.filter(
        (item) =>
          item.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.correo.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.telefono.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.direccion.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.tipoProveedor.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return queryData;
  }, [queryData, searchValue]);

  const proveedorColumns: Column<Proveedor>[] = [
    {
      key: "nombre",
      label: "Nombre",
      render: (proveedor) => (
        <div className="font-medium">{proveedor.nombre}</div>
      ),
      sortable: true,
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (proveedor) => (
        <span className="font-medium">{proveedor.telefono}</span>
      ),
      sortable: true,
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      render: (proveedor) => (
        <div className="text-sm text-muted-foreground line-clamp-1">
          {proveedor.correo}
        </div>
      ),
      sortable: true,
    },
    {
      key: "direccion",
      label: "Dirección",
      render: (proveedor) => (
        <div className="text-sm text-muted-foreground line-clamp-1">
          {proveedor.direccion}
        </div>
      ),
      sortable: false,
      width: "w-64",
    },
    {
      key: "tipoProveedor",
      label: "Tipo",
      render: (proveedor) => (
        <Badge variant="outline">{proveedor.tipoProveedor}</Badge>
      ),
      sortable: true,
    },
  ];

  const handleOnSubmitSelectMultiple = ({
    primary,
    secondary,
  }: {
    primary: Proveedor | null;
    secondary: Product[];
  }) => {
    const productoId = secondary.map((item) => Number(item.id));
    const proveedorId = Number(primary?.id) || 0;

    assignProveedorToProductoMutation.mutate({
      productoId: productoId,
      proveedorId: proveedorId,
    });
  };

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

      <FormProveedoresModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={modalMode}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        section="proveedores"
        onDelete={handleDelete}
      />

      <SelectMultipleModal<Proveedor, Product>
        isOpen={isSelectMultipleModalOpen}
        onClose={() => setIsSelectMultipleModalOpen(false)}
        sectionPrimary="proveedores"
        sectionSecondary="productos"
        dataPrimary={filteredData}
        dataSecondary={productos}
        getPrimaryId={(item) => item.id}
        getSecondaryId={(item) => item.id}
        renderPrimaryItem={(item, isSelected) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{item.nombre}</span>
            {isSelected && <Check className="h-4 w-4 text-green-500" />}
          </div>
        )}
        renderSecondaryItem={(item, isSelected) => (
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{item.nombreProducto}</span>
            {isSelected && <Check className="h-4 w-4 text-green-500" />}
          </div>
        )}
        description="Seleccione proveedores y productos"
        onSubmit={handleOnSubmitSelectMultiple}
        title="Seleccionar Proveedores y Productos"
      />
      <ModalTable
        isOpen={isAllOpen}
        onClose={() => setIsAllOpen(false)}
        section="proveedores"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filteredData={filteredData}
        columns={proveedorColumns}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
      />
    </>
  );
}
