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
import { getTiposNegocio, getUsuarioNegocio } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import {
  NegociosFormData,
  NegocioFormSchema,
  Negocio,
  TipoNegocio,
} from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: NegociosFormData, id?: string) => Promise<void>;
}

export function FormNegociosModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | null>(null);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const { session } = useUser();
  const [tiposNegocio, setTiposNegocio] = useState<TipoNegocio[]>([]);

  const { data, error } = useQuery({
    queryKey: ["negocios"],
    queryFn: () =>
      getUsuarioNegocio(session?.accessToken || "", session?.user.id || 0),
  });

  const { data: tipos } = useQuery({
    queryKey: ["tiposNegocio"],
    queryFn: () => getTiposNegocio(session?.accessToken || ""),
  });

  const form = useForm<NegociosFormData>({
    resolver: zodResolver(NegocioFormSchema),
    defaultValues: {
      nombreNegocio: "",
      direccion: "",
      tipoNegocio: "",
      telefono: "",
      correo: "",
    },
  });

  useEffect(() => {
    if (tipos) {
      setTiposNegocio(tipos);
    }
  }, [tipos]);

  useEffect(() => {
    if (data) {
      setNegocios(data);
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
      nombreNegocio: selectedNegocio?.nombreNegocio || "",
      direccion: selectedNegocio?.direccion || "",
      tipoNegocio: selectedNegocio?.tipoNegocio || "",
      telefono: selectedNegocio?.telefono || "",
      correo: selectedNegocio?.correo || "",
    });
  }, [selectedNegocio, form]);

  useEffect(() => {
    if (mode === "create") {
      form.reset({
        nombreNegocio: "",
        direccion: "",
        tipoNegocio: "",
        telefono: "",
        correo: "",
      });
      setSelectedNegocio(null); // Limpia también la selección anterior
    }
  }, [mode, form]);

  const filteredNegocios = useMemo(() => {
    console.log(negocios);
    return negocios.filter((negocio) => {
      return (
        negocio.nombreNegocio
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        negocio.tipoNegocio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, negocios]);

  const handleSubmit = async (data: NegociosFormData) => {
    console.log("sahhjas");

    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedNegocio?.id);
      form.reset();
      setSelectedNegocio(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log("Closing modal");

    form.reset();
    setSelectedNegocio(null);
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
                {mode === "create" ? `Registrar negocio` : `Actualizar negocio`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para registrar un nuevo negocio`
                  : `Modifica la información del negocio seleccionado`}
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
                placeholder={`Buscar por nombre o tipo de negocio...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Negocios Disponibles ({negocios.length})
                </h3>
                {selectedNegocio && (
                  <Badge variant="outline" className="text-xs">
                    Negocio Seleccionado
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[200px] w-full border rounded-md">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredNegocios.map((negocio) => (
                      <motion.div
                        key={negocio.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                            selectedNegocio?.id === negocio.id
                              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedNegocio(negocio)}
                        >
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {negocio.nombreNegocio}
                                  </h4>
                                </div>
                              </div>
                              {selectedNegocio?.id === negocio.id && (
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

                  {negocios.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron negocios</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.log("Errores de validación", errors);
            })}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombreNegocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del negocio*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre del negocio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipoNegocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de negocio*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        {/* i need that the width be the same everywhere */}
                        <SelectTrigger>
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposNegocio.map((tipo) => (
                          <SelectItem
                            key={String(tipo.id)}
                            value={tipo.nombreTipoNegocio}
                          >
                            {tipo.nombreTipoNegocio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Ingrese el teléfono" {...field} />
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
                      <Input placeholder="Ingrese la dirección" {...field} />
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
                    <FormLabel>Correo electrónico*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el correo" {...field} />
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
              <Button type="submit">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {mode === "create" ? "Registrar" : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
