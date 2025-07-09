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
import { TiposFormData, Tipos, tiposFormSchema } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { getTipos } from "@/lib/api";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: TiposFormData, id?: string) => Promise<void>;
}

export function FormModalTipos({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipos, setSelectedTipos] = useState<Tipos | null>(null);
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["tipos"],
    queryFn: () => getTipos(session?.accessToken || ""),
  });

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Unauthorized access. Please log in.");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
      return;
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setTipos(data);
    }
  }, [data]);

  useEffect(() => {
    form.reset({
      nombreTipoProducto: selectedTipos?.nombreTipoProducto || "",
    });
  }, [selectedTipos]);

  const form = useForm<TiposFormData>({
    resolver: zodResolver(tiposFormSchema),
    defaultValues: {
      nombreTipoProducto: "",
    },
  });

  const filteredtipos = useMemo(() => {
    return tipos.filter((tipo) =>
      tipo.nombreTipoProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tipos]);

  const handleSubmit = async (data: TiposFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedTipos?.id);
      form.reset();
      setSelectedTipos(null);
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
    setSelectedTipos(null);
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
                {mode === "create" ? `Crear Tipo` : `Actualizar Tipo`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para crear un nuevo tipo`
                  : `Modifica la información del tipo seleccionado`}
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
                placeholder={`Buscar por nombre o ID del tipo...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Tipos Disponibles ({tipos.length})
                </h3>
                {selectedTipos && (
                  <Badge variant="outline" className="text-xs">
                    Tipo Seleccionado
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[200px] w-full border rounded-md">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredtipos.map((tipo) => (
                      <motion.div
                        key={tipo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                            selectedTipos?.id === tipo.id
                              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedTipos(tipo)}
                        >
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {tipo.nombreTipoProducto}
                                  </h4>
                                </div>
                              </div>
                              {selectedTipos?.id === tipo.id && (
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

                  {tipos.length === 0 && (
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
            <div className="grid gap-4 md:grid-cols-2">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="nombreTipoProducto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del tipo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${"Nombre del tipo o categoría"}`}
                        {...field}
                      />
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
                {mode === "create" ? "Crear" : "Actualizar"} Tipo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
