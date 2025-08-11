import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { z } from "zod";

type ProductAction = {
  title: string;
  description: string;
  actions: Action[];
};

type AnonymousAction = {
  title: string;
  description: string;
  actions: Action[];
};

type User = {
  id: number;
  nombre: string;
  correo: string;
  negocio: number;
  roles: string[];
  exp: number;
};

export const productFormSchema = z
  .object({
    productName: z
      .string()
      .min(1, "El nombre del producto es requerido")
      .max(100, "Máximo 100 caracteres"),
    description: z
      .string()
      .min(1, "La descripción es requerida")
      .max(500, "Máximo 500 caracteres"),
    currentStock: z
      .number()
      .min(0, "El stock actual debe ser mayor o igual a 0"),
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
  });

type ProductFormData = z.infer<typeof productFormSchema>;

/*
nombreCliente = models.CharField(max_length=100)
    apellidoCliente = models.CharField(max_length=100)
    correo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    direccion = models.TextField()

*/

export const clientesFormSchema = z.object({
  nombreCliente: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  apellidoCliente: z
    .string()
    .min(1, "El apellido es requerido")
    .max(100, "Máximo 100 caracteres"),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(100, "Máximo 100 caracteres"),
  direccion: z
    .string()
    .min(1, "La dirección es requerida")
    .max(500, "Máximo 500 caracteres"),
});

type ClientFormData = z.infer<typeof clientesFormSchema>;

export const proveedoresFormSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(20, "Máximo 20 caracteres"),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres"),
  direccion: z
    .string()
    .min(1, "La dirección es requerida")
    .max(500, "Máximo 500 caracteres"),
  tipoProveedor: z
    .string()
    .min(1, "El tipo de proveedor es requerido")
    .max(100, "Máximo 100 caracteres"),
});

type ProveedoresFormData = z.infer<typeof proveedoresFormSchema>;

export const CategoriasFormSchema = z.object({
  nombreCategoria: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
});

type CategoriasFormData = z.infer<typeof CategoriasFormSchema>;

type CategoriasFormDataUpdate = CategoriasFormData & {
  id: string;
};

export const tiposFormSchema = z.object({
  nombreTipoProducto: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
});

type TiposFormData = z.infer<typeof tiposFormSchema>;

type TiposFormDataUpdate = TiposFormData & {
  id: string;
};

type ProductFormDataUpdate = ProductFormData & {
  id: string;
};

type Action = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  permissions: string;
  permissionIcon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  action: string;
};

/*

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=100)
    direccion = models.TextField()
    tipoProveedor = models.CharField(max_length=100)

class ProveedorProducto(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
*/

type Proveedor = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  tipoProveedor: string;
};

/*
class TipoNegocio(models.Model):
    nombreTipoNegocio = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "tipo negocio"
        verbose_name_plural = "tipo negocios"

class TblNegocio(models.Model):
    nombreNegocio = models.CharField(max_length=100)
    direccion = models.TextField()
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=255)
    fechaCreacion = models.DateField()
    tipoNegocio = models.ForeignKey(TipoNegocio, on_delete=models.SET_NULL, null=True)

class UsuarioNegocio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('usuario', 'negocio')
        db_table = 'tbl_negocio_has_Usuario'
*/

interface TipoNegocio {
  id: string;
  nombreTipoNegocio: string;
  descripcion: string;
}

type Negocio = {
  id: string;
  nombreNegocio: string;
  propietario?: number;
  direccion: string;
  telefono: string;
  correo: string;
  fechaCreacion?: string;
  tipoNegocio: string;
  tipoNegocioDetails?: TipoNegocio;
};

type NegocioSuperAdmin = Omit<Negocio, "tipoNegocioDetails" | "tipoNegocio"> & {
  propietario: Pick<User, "id" | "nombre" | "correo">;
  tipoNegocio: {
    id: string;
    nombre: string;
  };
};

type UsuarioNegocio = {
  id: string;
  usuario: Pick<User, "id">;
  negocio: Pick<Negocio, "id">;
};

export const NegocioFormSchema = z.object({
  nombreNegocio: z
    .string()
    .min(1, "El nombre del negocio es requerido")
    .max(100, "Máximo 100 caracteres"),
  direccion: z
    .string()
    .min(1, "La dirección es requerida")
    .max(500, "Máximo 500 caracteres"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(20, "Máximo 20 caracteres"),
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres"),
  tipoNegocio: z.string().min(1, "El tipo de negocio es requerido"),
});

type NegociosFormData = z.infer<typeof NegocioFormSchema>;

export const TipoNegocioFormSchema = z.object({
  nombreTipoNegocio: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  descripcion: z
    .string()
    .min(1, "La descripcion es requerida")
    .max(500, "Máximo 500 caracteres"),
});

type TipoNegocioFormData = z.infer<typeof TipoNegocioFormSchema>;

export const UsuarioNegocioFormSchema = z.object({
  usuario: z.string().min(1, "El usuario es requerido"),
  negocio: z.string().min(1, "El negocio es requerido"),
});

type UsuarioNegocioFormData = z.infer<typeof UsuarioNegocioFormSchema>;

type ProveedorProducto = {
  id: string;
  proveedor: Pick<Proveedor, "id">;
  producto: Pick<Product, "id">;
};
type Client = {
  id: string;
  nombreCliente: string;
  apellidoCliente: string;
  correo: string;
  telefono: string;
  direccion: string;
};

type Product = {
  id: string;
  nombreProducto: string;
  descripcion: string;
  stockActual: number;
  stockMin: number;
  stockMax: number;
  unidadMedida: string;
  precioVenta: number;
  categoria: string;
  tipo: string;
};

type Tipos = {
  id: string;
  nombreTipoProducto: string;
};
type Categorias = {
  id: string;
  nombreCategoria: string;
};
type DataItem = Product | Categorias | Tipos;

type filterOptions = {
  key: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
};

export const facturaFormSchema = z.object({
  clienteId: z.number().min(1, "Selecciona un cliente"),
  productos: z
    .array(
      z.object({
        productoId: z.string().min(1),
        cantidad: z
          .number({ invalid_type_error: "Cantidad inválida" })
          .min(1, "Debe ser al menos 1"),
      })
    )
    .min(1, "Agrega al menos un producto"),
});

export type FacturaFormData = z.infer<typeof facturaFormSchema>;

type Empleado = {
  correo: string;
  nombre: string;
  password: string;
  negocio: number;
  salario: number;
};

export const EmpleadoFormSchema = z.object({
  correo: z
    .string()
    .email("Correo electrónico inválido")
    .max(100, "Máximo 100 caracteres"),
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(100, "Máximo 100 caracteres"),
  salario: z.number().min(0, "El salario debe ser mayor o igual a 0"),
});

type EmpleadoFormData = z.infer<typeof EmpleadoFormSchema>;

export type {
  DataItem,
  filterOptions,
  CategoriasFormDataUpdate,
  CategoriasFormData,
  TiposFormDataUpdate,
  ProductAction,
  TiposFormData,
  Action,
  Product,
  ProductFormData,
  User,
  ProductFormDataUpdate,
  Tipos,
  Categorias,
  AnonymousAction,
  ClientFormData,
  Client,
  Proveedor,
  ProveedorProducto,
  ProveedoresFormData,
  Negocio,
  TipoNegocio,
  UsuarioNegocio,
  UsuarioNegocioFormData,
  NegociosFormData,
  TipoNegocioFormData,
  Empleado,
  EmpleadoFormData,
  NegocioSuperAdmin,
};
