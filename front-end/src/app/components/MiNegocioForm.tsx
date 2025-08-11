import {
  Negocio,
  NegociosFormData,
  NegocioFormSchema,
  TipoNegocio,
} from "@/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTiposNegocio, updateNegocio } from "@/lib/api";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";

type FormMinegocioProps = {
  negocio: Negocio;
};

export function FormMinegocio({ negocio }: FormMinegocioProps) {
  const { session } = useUser();
  const [tiposNegocio, setTiposNegocio] = useState<TipoNegocio[]>([]);

  const queryClient = useQueryClient();
  const form = useForm<NegociosFormData>({
    resolver: zodResolver(NegocioFormSchema),
    defaultValues: {
      nombreNegocio: negocio?.nombreNegocio || "",
      direccion: negocio?.direccion || "",
      tipoNegocio: negocio?.tipoNegocio || "",
      telefono: negocio?.telefono || "",
      correo: negocio?.correo || "",
    },
  });

  const { data: tipos } = useQuery({
    queryKey: ["tiposNegocio"],
    queryFn: () => getTiposNegocio(session?.accessToken || ""),
  });

  useEffect(() => {
    if (tipos) {
      setTiposNegocio(tipos);
    }
  }, [tipos]);

  const actualizarDatosNegocio = useMutation({
    mutationFn: (data: NegociosFormData) => {
      return updateNegocio(
        {
          ...data,
          id: session?.user.negocio.toString() || "",
        },
        session?.accessToken || ""
      );
    },
    onSuccess: () => {
      console.log("Negocio actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["minegocio"] });
    },
  });

  const handleSubmit = async (data: NegociosFormData) => {
    actualizarDatosNegocio.mutate(data);
  };

  return (
    <>
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
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
