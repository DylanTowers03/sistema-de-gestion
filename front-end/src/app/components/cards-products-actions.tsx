import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  containerVariants,
  cardVariants,
  getColorClasses,
  getIconColorClasses,
  getBadgeColorClasses,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  CategoriasFormData,
  CategoriasFormDataUpdate,
  ProductAction,
  ProductFormData,
  ProductFormDataUpdate,
  TiposFormData,
  TiposFormDataUpdate,
} from "@/types/types";
import React from "react";
import { FormModal } from "@/app/components/form-product-modal";
import { DeleteModal } from "./delete-modal";
import { useDashboardWindow } from "@/app/components/DashboardWindowProvider";
import {
  createCategoria,
  createProduct,
  createTipo,
  updateCategoria,
  updateProduct,
  updateTipo,
  deleteCategoria,
  deleteProduct,
  deleteTipo,
} from "@/lib/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useUser } from "./UserContext";
import { FormModalTipos } from "@/app/components/form-tipos-modal";
import { FormModalCategorias } from "./form-categorias-modal";
import { useRouter } from "next/navigation";

export default function CardsActions({
  title,
  description,
  actions,
}: ProductAction) {
  const router = useRouter();
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "update">(
    "create"
  );
  const { whatIsOpen } = useDashboardWindow();
  const { session } = useUser();

  const queryClient = useQueryClient();

  const { mutate: createProductMutation } = useMutation({
    mutationFn: (data: ProductFormData) =>
      createProduct(
        {
          nombreProducto: data.productName,
          descripcion: data.description,
          stockActual: data.currentStock,
          stockMin: data.minStock,
          stockMax: data.maxStock,
          unidadMedida: data.unitOfMeasure,
          precioVenta: data.salePrice,
          categoria: data.category,
          tipo: data.type,
        },
        session?.accessToken || ""
      ),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
      toast.success("Product created successfully");
    },
    onError: (error: AxiosError) => {
      if (error.status === 401 || error.status === 403) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      } else {
        console.log("Failed to create product:", error);

        toast.error("Failed to create product. Please try again.");
      }
    },
  });

  const { mutate: updateProductMutation } = useMutation({
    mutationFn: (data: Partial<ProductFormDataUpdate>) =>
      updateProduct(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        console.error("Unauthorized access. Please log in.");
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }

      if (error.status === 403) {
        toast.error(
          "Forbidden access. You do not have permission to update this product."
        );
        return;
      }

      if (error.status === 404) {
        toast.error("Product not found. Please check the product ID.");
        return;
      }

      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again.");
    },
  });

  const { mutate: updateTiposMutation } = useMutation({
    mutationFn: (data: Partial<TiposFormDataUpdate>) =>
      updateTipo(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      toast.success("Tipos created successfully");
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }

      if (error.status === 403) {
        toast.error(
          "Forbidden access. You do not have permission to update this product."
        );
        return;
      }
    },
  });

  const { mutate: createTiposMutation } = useMutation({
    mutationFn: (data: TiposFormData) =>
      createTipo(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      toast.success("Tipos created successfully");
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }

      if (error.status === 403) {
        toast.error(
          "Forbidden access. You do not have permission to update this product."
        );
        return;
      }
    },
  });

  const { mutate: createCategoriasMutation } = useMutation({
    mutationFn: (data: CategoriasFormData) =>
      createCategoria(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      toast.success("Categorias created successfully");
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }

      if (error.status === 403) {
        toast.error(
          "Forbidden access. You do not have permission to update this categoria."
        );
        return;
      }
    },
  });
  const { mutate: updateCategoriasMutation } = useMutation({
    mutationFn: (data: Partial<CategoriasFormDataUpdate>) =>
      updateCategoria(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      toast.success("Categorias created successfully");
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }

      if (error.status === 403) {
        toast.error(
          "Forbidden access. You do not have permission to update this categoria."
        );
        return;
      }
    },
  });

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (id: string) =>
      deleteProduct(Number(id), session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }
      if (error.status === 403) {
        toast.error("Forbidden access. You do not have permission to delete.");
      }
    },
  });

  const { mutate: deleteTipoMutation } = useMutation({
    mutationFn: (id: string) =>
      deleteTipo(Number(id), session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      toast.success("Tipos deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }
      if (error.status === 403) {
        toast.error("Forbidden access. You do not have permission to delete.");
      }
    },
  });

  const { mutate: deleteCategoriaMutation } = useMutation({
    mutationFn: (id: string) =>
      deleteCategoria(Number(id), session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      toast.success("Categorias deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error("Unauthorized access. Please log in.");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
      }
      if (error.status === 403) {
        toast.error("Forbidden access. You do not have permission to delete.");
      }
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
      case "view":
        if (whatIsOpen === "productos") {
          router.push(`/dashboard/productos/`);
        }
        break;
    }
  };

  const handleFormSubmit = async (data: ProductFormData, id?: string) => {
    if (modalMode === "create") {
      createProductMutation(data);
    }

    if (modalMode === "update") {
      updateProductMutation({
        ...data,
        id: id || "", // Ensure id is provided
      });
    }

    if (whatIsOpen === "tipos") {
      console.log("whatIsOpen:", data);
    }

    setIsFormModalOpen(false);
  };

  const handleFormTiposSubmit = async (data: TiposFormData, id?: string) => {
    if (modalMode === "create") {
      createTiposMutation(data);
    }

    if (modalMode === "update") {
      updateTiposMutation({
        ...data,
        id: id || "", // Ensure id is provided
      });
    }
  };

  const handleFormCategoriasSubmit = async (
    data: CategoriasFormData,
    id?: string
  ) => {
    if (modalMode === "create") {
      createCategoriasMutation(data);
    }

    if (modalMode === "update") {
      updateCategoriasMutation({
        ...data,
        id: id || "", // Ensure id is provided
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (whatIsOpen === "productos") {
      deleteProductMutation(id);
    } else if (whatIsOpen === "tipos") {
      deleteTipoMutation(id);
    } else if (whatIsOpen === "categorias") {
      deleteCategoriaMutation(id);
    }
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

      {whatIsOpen === "productos" && (
        <FormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          mode={modalMode}
          onSubmit={handleFormSubmit}
          section={whatIsOpen}
        />
      )}

      {
        // Tipos
        whatIsOpen === "tipos" && (
          <FormModalTipos
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            mode={modalMode}
            onSubmit={handleFormTiposSubmit}
          />
        )
      }

      {
        // Categorias
        whatIsOpen === "categorias" && (
          <FormModalCategorias
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            mode={modalMode}
            onSubmit={handleFormCategoriasSubmit}
          />
        )
      }

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        section={whatIsOpen}
      />
    </>
  );
}
