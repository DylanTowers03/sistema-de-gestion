
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { z } from "zod"

type ProductAction = {
  title: string;
  description: string;
  actions: Action[];
};

type User = {
    id: number;
    nombre: string;
    correo: string;
    roles : string[];
    exp: number;
}

export const productFormSchema = z
  .object({
    productName: z.string().min(1, "El nombre del producto es requerido").max(100, "Máximo 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(500, "Máximo 500 caracteres"),
    currentStock: z.number().min(0, "El stock actual debe ser mayor o igual a 0"),
    minStock: z.number().min(0, "El stock mínimo debe ser mayor o igual a 0"),
    maxStock: z.number().min(1, "El stock máximo debe ser mayor a 0"),
    unitOfMeasure: z.string().min(1, "La unidad de medida es requerida"),
    salePrice: z.number().min(0.01, "El precio de venta debe ser mayor a 0"),
    category: z.string().min(1, "La categoría es requerida"),
    type: z.string().min(1, "El tipo es requerido"),
  })
  .refine((data) => data.maxStock >= data.minStock, {
    message: "El stock máximo debe ser mayor o igual al stock mínimo",
    path: ["maxStock"],
  })
  .refine((data) => data.currentStock <= data.maxStock, {
    message: "El stock actual no puede ser mayor al stock máximo",
    path: ["currentStock"],
  })

type ProductFormData = z.infer<typeof productFormSchema>


export const CategoriasFormSchema = z
  .object({
    nombreCategoria: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  })

type CategoriasFormData = z.infer<typeof 
CategoriasFormSchema>

type CategoriasFormDataUpdate = CategoriasFormData & {
  id: string;
}

export const tiposFormSchema = z
  .object({
    nombreTipoProducto: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  })

type TiposFormData = z.infer<typeof tiposFormSchema>

type TiposFormDataUpdate = TiposFormData & {
  id: string;
}

type ProductFormDataUpdate = ProductFormData & {
  id: string;
}

type Action = {
    title: string;
    description: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    permissions: string;
    permissionIcon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    color: string;
    action: string;
}

type Product = {
  id: string
  nombreProducto: string
  descripcion: string
  stockActual: number
  stockMin: number
  stockMax: number
  unidadMedida: string
  precioVenta: number
  categoria: string
  tipo: string
  
}

type Tipos = {
  id: string;
  nombreTipoProducto: string;
}
type Categorias = {
  id: string;
  nombreCategoria: string;
}
type DataItem = Product | Categorias | Tipos


type filterOptions= {
    key: string;
    label: string;
    options: {
        value: string;
        label: string;
    }[];
}
export type { DataItem,filterOptions , CategoriasFormDataUpdate, CategoriasFormData,  TiposFormDataUpdate,ProductAction, TiposFormData,Action,Product, ProductFormData, User , ProductFormDataUpdate, Tipos, Categorias };
