"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { Product } from "@/types/types";
import { useUser } from "./UserContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export function FacturaProductos() {
  const [productos, setProductos] = useState<Product[]>([]);
  const { session } = useUser();
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const { data } = useQuery({
    queryKey: ["productos"],
    queryFn: () => getProducts(session?.accessToken || ""),
  });

  useEffect(() => {
    if (data) {
      setProductos(data);
    }
  }, [data]);

  const selectedProductos = watch("productos") || [];

  // Obtener datos actuales del form

  const totalFactura = selectedProductos.reduce((total: number, item) => {
    const producto = productos?.find(
      (p) => Number(p.id) === Number(item.productoId)
    );
    const precio = producto?.precioVenta || 0;
    const cantidad = Number(item.cantidad) || 0;
    return total + precio * cantidad;
  }, 0);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Productos seleccionados
      </h3>

      {fields.map((field, index) => {
        const selectedId = selectedProductos?.[index]?.productoId;

        const selectedProducto = productos?.find(
          (p: Product) => Number(p.id) === Number(selectedId)
        );

        const precio = selectedProducto?.precioVenta || 0;
        const cantidad = parseInt(selectedProductos?.[index]?.cantidad) || 0;
        const total = precio * cantidad;

        return (
          <div key={field.id} className="flex items-center gap-2">
            {/* Producto */}
            <Controller
              control={control}
              name={`productos.${index}.productoId`}
              render={({ field }) => (
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos?.map((producto: Product) => (
                      <SelectItem
                        key={producto.id}
                        value={producto.id.toString()}
                      >
                        {producto.nombreProducto} (${producto.precioVenta})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {/* Cantidad */}
            <Input
              type="number"
              placeholder="Cantidad"
              className="w-20"
              {...register(`productos.${index}.cantidad`, {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
            />

            {/* Total por producto */}
            <div className="text-sm text-muted-foreground w-28">
              ${isNaN(total) ? "0.00" : total.toFixed(2)}
            </div>

            {/* Eliminar */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              size="icon"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() => append({ productoId: "", cantidad: 1 })}
        variant="outline"
      >
        + Agregar producto
      </Button>

      <div className="mt-4 text-right font-semibold text-lg">
        Total: ${totalFactura.toLocaleString("es-CO")}
      </div>
    </div>
  );
}
