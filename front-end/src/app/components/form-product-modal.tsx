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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Save, Search, X } from "lucide-react";
import {
  productFormSchema,
  ProductFormData,
  Product,
  Categorias,
  Tipos,
} from "@/types/types";
import { getProducts, getCategorias, getTipos } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "update";
  section: "productos" | "tipos" | "categorias";
  onSubmit: (data: ProductFormData, id?: string) => Promise<void>;
}

const unitOfMeasures = [
  { value: "unit", label: "Unidad" },
  { value: "kg", label: "Kilogramo" },
  { value: "g", label: "Gramo" },
  { value: "l", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "m", label: "Metro" },
  { value: "cm", label: "Centímetro" },
];

export function FormModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
  section = "productos",
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categorias[]>([]);
  const [types, setTypes] = useState<Tipos[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["productos"],
    queryFn: () => getProducts(session?.accessToken || ""),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getCategorias(session?.accessToken || ""),
  });

  const { data: typesData } = useQuery({
    queryKey: ["tipos"],
    queryFn: () => getTipos(session?.accessToken || ""),
  });

  useEffect(() => {
    if (categoriesData) {
      console.log(categoriesData);

      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (typesData) {
      setTypes(typesData);
    }
  }, [typesData]);

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Unauthorized access. Please log in.");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
      return;
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    form.reset({
      productName: selectedProduct?.nombreProducto || "",
      description: selectedProduct?.descripcion || "",
      currentStock: selectedProduct?.stockActual || 0,
      minStock: selectedProduct?.stockMin || 0,
      maxStock: selectedProduct?.stockMax || 100,
      unitOfMeasure: selectedProduct?.unidadMedida || "",
      salePrice: selectedProduct?.precioVenta || 0,
      category: selectedProduct?.categoria || "",
      type: selectedProduct?.tipo || "",
    });
  }, [selectedProduct]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      description: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 100,
      unitOfMeasure: "",
      salePrice: 0,
      category: "",
      type: "",
    },
  });

  const filteredProducts = useMemo(() => {
    console.log(products[0]);

    return products.filter((product) =>
      product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleSubmit = async (data: ProductFormData) => {
    console.log(data);

    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedProduct?.id);
      form.reset();
      setSelectedProduct(null);
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
    setSelectedProduct(null);
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
                  ? `Crear ${section}`
                  : `Actualizar ${section}`}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? `Completa la información para crear un nuevo ${section}`
                  : `Modifica la información del ${section} seleccionado`}
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
                placeholder={`Buscar por nombre o ID del ${section}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {section} Disponibles ({products.length})
                </h3>
                {selectedProduct && (
                  <Badge variant="outline" className="text-xs">
                    {section} Seleccionado
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[200px] w-full border rounded-md">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                            selectedProduct?.id === product.id
                              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {product.nombreProducto}
                                  </h4>
                                </div>
                              </div>
                              {selectedProduct?.id === product.id && (
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

                  {products.length === 0 && (
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
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del {section}*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${
                          section === "productos"
                            ? "Ej: Laptop Dell Inspiron"
                            : "Nombre del tipo o categoría"
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit of Measure */}
              {section === "productos" && (
                <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad de Medida *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar unidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitOfMeasures.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Description */}
            {section === "productos" && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe las características principales del producto..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {section === "productos" && (
              <div className="grid gap-4 md:grid-cols-3">
                {/* Current Stock */}
                <FormField
                  control={form.control}
                  name="currentStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Actual *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Min Stock */}
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Mínimo *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Stock */}
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Máximo *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {section === "productos" && (
              <div className="grid gap-4 md:grid-cols-3">
                {/* Sale Price */}
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio de Venta *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría *</FormLabel>
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
                          {categories.map((category) => (
                            <SelectItem
                              key={String(category.id)}
                              value={category.nombreCategoria}
                            >
                              {category.nombreCategoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.nombreTipoProducto}
                            >
                              {type.nombreTipoProducto}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
                {mode === "create" ? "Crear" : "Actualizar"} {section}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
