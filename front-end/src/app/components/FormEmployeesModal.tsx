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
import { Loader2, Users, Save, Search, X } from "lucide-react";
import { getEmpleados } from "@/lib/api"; // 🔹 Debes crearlo
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { Empleado, EmpleadoFormData, EmpleadoFormSchema } from "@/types/types";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  onSubmit: (data: EmpleadoFormData, id?: string) => Promise<void>;
}

export function FormEmpleadosModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["empleados"],
    queryFn: () =>
      getEmpleados(session?.accessToken || "", session?.user.negocio || 0), // 🔹 Debes crearlo
  });

  const form = useForm<EmpleadoFormData>({
    resolver: zodResolver(EmpleadoFormSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      password: "",
      salario: 0,
    },
  });

  useEffect(() => {
    if (data) {
      setEmpleados(data);
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
      nombre: selectedEmpleado?.nombre || "",
      correo: selectedEmpleado?.correo || "",
      password: selectedEmpleado?.password || "",
      salario: selectedEmpleado?.salario || 0,
    });
  }, [selectedEmpleado, form]);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter(
      (emp) =>
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, empleados]);

  const handleSubmit = async (data: EmpleadoFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      setSelectedEmpleado(null);
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
    setSelectedEmpleado(null);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {mode === "create" ? `Crear empleado` : `Actualizar empleado`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para crear un nuevo empleado`
                  : `Modifica la información del empleado seleccionado`}
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
                placeholder={`Buscar por nombre o correo...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] w-full border rounded-md">
              <div className="p-2 space-y-2">
                <AnimatePresence>
                  {filteredEmpleados.map((emp) => (
                    <motion.div
                      key={emp.correo}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                          selectedEmpleado?.correo === emp.correo
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedEmpleado(emp)}
                      >
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {emp.nombre}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {emp.correo}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {empleados.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No se encontraron empleados</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Formulario */}
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
                      <Input placeholder="Ingrese el nombre" {...field} />
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
                      <Input placeholder="Ingrese el correo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ingrese la contraseña"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingrese el salario"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                {mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
