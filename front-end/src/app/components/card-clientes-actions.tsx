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
import { AnonymousAction, Client, ClientFormData } from "@/types/types";
import { motion } from "motion/react";
import { FormClientesModal } from "@/app/components/form-clientes-modal";
import { useMutation } from "@tanstack/react-query";
import { createClient, deleteClient, updateClient } from "@/lib/api";
import { useUser } from "./UserContext";
import { DeleteModal } from "./delete-modal";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ModalTable } from "./ModalTable";
export default function CardsClientesActions({
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
  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) =>
      createClient(data, session?.accessToken || ""),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
      toast.success("Client created successfully");
    },
    onError: (error: AxiosError) => {
      returnErrorMessage(error);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: Client) =>
      updateClient(
        {
          ...data,
        },
        session?.accessToken || ""
      ),
    onSuccess: () => {
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
      toast.success("Client updated successfully");
    },
    onError: (error: AxiosError) => {
      console.error("Error creating client:", error);
      returnErrorMessage(error);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id, session?.accessToken || ""),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
      toast.success("Client deleted successfully");
    },
    onError: (error: AxiosError) => {
      console.error("Error deleting client:", error);
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
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleteModalOpen(false);
    deleteClientMutation.mutate(id);
  };

  async function handleFormSubmit(
    data: ClientFormData,
    id?: string | undefined
  ) {
    if (modalMode === "create") {
      createClientMutation.mutate(data);
    }
    if (modalMode === "update") {
      updateClientMutation.mutate({
        ...data,
        id: id || "",
      });
    }
  }

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
      <FormClientesModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={modalMode}
        onSubmit={handleFormSubmit}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        section="clientes"
        onDelete={handleDelete}
      />

      <ModalTable
        isOpen={isAllOpen}
        onClose={() => setIsAllOpen(false)}
        section="clientes"
      />
    </>
  );
}
