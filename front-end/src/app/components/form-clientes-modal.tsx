"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Save, Search, X } from "lucide-react";
import { getClients } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { ClientFormData, clientesFormSchema, Client } from "@/types/types";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: ClientFormData, id?: string) => Promise<void>;
}

export function FormClientesModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => getClients(session?.accessToken || ""),
  });

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientesFormSchema),
    defaultValues: {
      nombreCliente: "",
      apellidoCliente: "",
      correo: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (data) {
      setClients(data);
    }
  }, [data]);

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Unauthorized access. Please log in.");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
      return;
    }
  }, [error]);

  useEffect(() => {
    form.reset({
      nombreCliente: selectedClient?.nombreCliente || "",
      apellidoCliente: selectedClient?.apellidoCliente || "",
      correo: selectedClient?.correo || "",
      telefono: selectedClient?.telefono || "",
      direccion: selectedClient?.direccion || "",
    });
  }, [selectedClient, form]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      return (
        client.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellidoCliente
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        client.correo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, clients]);

  const handleSubmit = async (data: ClientFormData) => {
    console.log(data);

    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedClient?.id);
      form.reset();
      setSelectedClient(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedClient(null);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {mode === "create" ? `Crear cliente` : `Actualizar cliente`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para crear un nuevo cliente`
                  : `Modifica la información del cliente seleccionado`}
              </DialogDescription>
            </div>
          </div>
          <Badge
            variant={mode === "create" ? "default" : "secondary"}
            className="w-fit"
          >
            {mode === "create" ? "Nuevo" : "Edición"}
          </Badge>
        </DialogHeader>

        {mode === "update" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Buscar por nombre o ID del cliente...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  clientes Disponibles ({clients.length})
                </h3>
                {selectedClient && (
                  <Badge variant="outline" className="text-xs">
                    Cliente Seleccionado
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[200px] w-full border rounded-md">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredClients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                            selectedClient?.id === client.id
                              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedClient(client)}
                        >
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {client.nombreCliente}
                                  </h4>
                                </div>
                              </div>
                              {selectedClient?.id === client.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {clients.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron productos</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="nombreCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del cliente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Ingrese el nombre del cliente"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* apellido */}
                <FormField
                  control={form.control}
                  name="apellidoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido del cliente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Ingrese el apellido del cliente"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* telefono */}
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono del cliente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Ingrese el telefono del cliente"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* direccion */}
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direccion del cliente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Ingrese la direccion del cliente"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* correo */}
                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo del cliente*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Ingrese el correo del cliente"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {mode === "create" ? "Crear" : "Actualizar"}{" "}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
