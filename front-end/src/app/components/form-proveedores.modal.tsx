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
import { getProveedores } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import {
  ProveedoresFormData,
  proveedoresFormSchema,
  Proveedor,
} from "@/types/types";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: ProveedoresFormData, id?: string) => Promise<void>;
}

export function FormProveedoresModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null
  );
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["proveedores"],
    queryFn: () => getProveedores(session?.accessToken || ""),
  });

  const form = useForm<ProveedoresFormData>({
    resolver: zodResolver(proveedoresFormSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      correo: "",
      direccion: "",
      tipoProveedor: "",
    },
  });

  useEffect(() => {
    if (data) setProveedores(data);
  }, [data]);

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Acceso no autorizado. Inicia sesión.");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
    }
  }, [error]);

  useEffect(() => {
    form.reset({
      nombre: selectedProveedor?.nombre || "",
      telefono: selectedProveedor?.telefono || "",
      correo: selectedProveedor?.correo || "",
      direccion: selectedProveedor?.direccion || "",
      tipoProveedor: selectedProveedor?.tipoProveedor || "",
    });
  }, [selectedProveedor, form]);

  const filteredProveedores = useMemo(() => {
    return proveedores.filter(
      (prov) =>
        prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, proveedores]);

  const handleSubmit = async (data: ProveedoresFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedProveedor?.id);
      form.reset();
      setSelectedProveedor(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedProveedor(null);
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
                {mode === "create" ? "Crear proveedor" : "Actualizar proveedor"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Completa la información para crear un nuevo proveedor"
                  : "Modifica la información del proveedor seleccionado"}
              </DialogDescription>
            </div>
          </div>
          <Badge variant={mode === "create" ? "default" : "secondary"}>
            {mode === "create" ? "Nuevo" : "Edición"}
          </Badge>
        </DialogHeader>

        {mode === "update" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] w-full border rounded-md">
              <div className="p-2 space-y-2">
                <AnimatePresence>
                  {filteredProveedores.map((prov) => (
                    <motion.div
                      key={prov.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer ${
                          selectedProveedor?.id === prov.id
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedProveedor(prov)}
                      >
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">
                                {prov.nombre}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {prov.correo}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {proveedores.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No se encontraron proveedores</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono*</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Correo del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección*</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoProveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de proveedor*</FormLabel>
                    <FormControl>
                      <Input placeholder="Tipo de proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
