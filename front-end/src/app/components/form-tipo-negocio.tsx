"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { getTiposNegocio } from "@/lib/api"; // cambia según tu API

// Tipo y esquema
export interface TipoNegocio {
  id: string;
  nombreTipoNegocio: string;
  descripcion: string;
}

export const TipoNegocioFormSchema = z.object({
  nombreTipoNegocio: z.string().min(1, "El nombre es requerido").max(100),
  descripcion: z.string().min(1, "La descripción es requerida").max(500),
});

type TipoNegocioFormData = z.infer<typeof TipoNegocioFormSchema>;

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: TipoNegocioFormData, id?: string) => Promise<void>;
}

export function FormModalTipoNegocio({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<TipoNegocio | null>(null);
  const [tipos, setTipos] = useState<TipoNegocio[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["tipos-negocio"],
    queryFn: () => getTiposNegocio(session?.accessToken || ""),
  });

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Acceso no autorizado. Inicia sesión nuevamente.");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setTipos(data);
    }
  }, [data]);

  const form = useForm<TipoNegocioFormData>({
    resolver: zodResolver(TipoNegocioFormSchema),
    defaultValues: {
      nombreTipoNegocio: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    form.reset({
      nombreTipoNegocio: selectedTipo?.nombreTipoNegocio || "",
      descripcion: selectedTipo?.descripcion || "",
    });
  }, [selectedTipo, form]);

  const filteredTipos = useMemo(() => {
    return tipos.filter((tipo) =>
      tipo.nombreTipoNegocio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tipos]);

  const handleSubmit = async (data: TipoNegocioFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedTipo?.id);
      form.reset();
      setSelectedTipo(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedTipo(null);
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
                {mode === "create"
                  ? `Crear Tipo de Negocio`
                  : `Actualizar Tipo`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para registrar un tipo de negocio`
                  : `Edita la información del tipo de negocio`}
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
                placeholder="Buscar tipo de negocio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] w-full border rounded-md">
              <div className="p-2 space-y-2">
                <AnimatePresence>
                  {filteredTipos.map((tipo) => (
                    <motion.div
                      key={tipo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer ${
                          selectedTipo?.id === tipo.id
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedTipo(tipo)}
                      >
                        <CardContent>
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">
                              {tipo.nombreTipoNegocio}
                            </h4>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombreTipoNegocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del tipo de negocio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción" {...field} />
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
