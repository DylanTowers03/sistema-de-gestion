"use client";
import React, { useEffect } from "react";
import { PageHeader } from "@/app/components/page-header";
import { DataSearchFilter } from "@/app/components/data-search-filter";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getTiposAndCategorias } from "@/lib/api";
import { useUser } from "@/app/components/UserContext";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Categorias, filterOptions, Product, Tipos } from "@/types/types";
import {
  DataTableProduct,
  type Column,
} from "@/app/components/data-table-product";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  TrendingUpDownIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function ProductosPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [filters, setFilters] = React.useState<filterOptions[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = React.useState<
    Record<string, string>
  >({});
  const [showFilters, setShowFilters] = React.useState(false);
  const [tipos, setTipos] = React.useState<Tipos[]>([]);
  const [categorias, setCategorias] = React.useState<Categorias[]>([]);

  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["tiposAndCategorias"],
    queryFn: () => getTiposAndCategorias(session?.accessToken || ""),
  });

  const { data: productsData } = useQuery({
    queryKey: ["productos"],
    queryFn: () => getProducts(session?.accessToken || ""),
  });

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setActiveFilters({});
  };

  useEffect(() => {
    console.log("categorias:", tipos);
  }, [tipos]);

  useEffect(() => {
    console.log("products:", products);
  }, [products]);
  const columns: Column[] = [
    {
      key: "name",
      label: "Producto",
      render: (product) => (
        <div className="space-y-1">
          <div className="font-medium">{product.nombreProducto}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {product.descripcion.slice(0, 50)}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "category",
      label: "Categoría",
      render: (product) => (
        <Badge variant="outline">
          {categorias.find((c) => c.id === product.categoria)?.nombreCategoria}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "type",
      label: "Tipo",
      render: (product) => (
        <Badge variant="secondary">
          {tipos.find((t) => t.id === product.tipo)?.nombreTipoProducto}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "currentStock",
      label: "Stock",
      render: (product) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{product.stockActual}</span>
          {product.stockActual <= product.stockMin && (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          {product.stockActual > product.stockMax * 0.8 && (
            <TrendingUp className="w-4 h-4 text-green-500" />
          )}
          {product.stockActual > product.stockMin &&
            product.stockActual < product.stockMax * 0.8 && (
              <TrendingUpDownIcon className="w-4 h-4 text-yellow-500" />
            )}
        </div>
      ),
      sortable: true,
    },
    {
      key: "salePrice",
      label: "Precio",
      render: (product) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">
            ${Number(product.precioVenta).toFixed(2)}
          </span>
        </div>
      ),
      sortable: true,
    },
  ];

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        searchValue === "" ||
        product.nombreProducto
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchValue.toLowerCase());

      const matchCategory =
        !activeFilters.categoria ||
        Number(product.categoria) === Number(activeFilters.categoria);
      const matchType =
        !activeFilters.tipo ||
        Number(product.tipo) === Number(activeFilters.tipo);

      return matchSearch && matchCategory && matchType;
    });
  }, [products, searchValue, activeFilters]);

  React.useEffect(() => {
    if (productsData) {
      console.log(productsData);

      setProducts(productsData);
    }
  }, [productsData]);

  React.useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        signOut({ redirect: true, callbackUrl: "/auth/login" });
        toast.error("Sesión expirada");
      }
    }
  }, [error]);

  React.useEffect(() => {
    if (data) {
      const { tipos, categorias } = data;

      const tiposOptions = {
        key: "tipo",
        label: "Tipo",
        options: tipos.map((tipo) => ({
          value: tipo.id.toString(),
          label: tipo.nombreTipoProducto,
        })),
      };

      const categoriasOptions = {
        key: "categoria",
        label: "Categoria",
        options: categorias.map((categoria) => ({
          value: categoria.id.toString(),
          label: categoria.nombreCategoria,
        })),
      };

      setFilters([tiposOptions, categoriasOptions]);
      setTipos(tipos);
      setCategorias(categorias);
    }
  }, [data]);

  return (
    <main className="flex-1">
      <div className="container mx-auto p-6 space-y-8">
        <PageHeader
          title="Productos"
          description="Administra y controla todos los productos de tu negocio"
          itemCount={filteredProducts.length}
          itemLabel="Productos"
        />
        <DataSearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          showAdvancedFilters={showFilters}
          onToggleAdvancedFilters={() => setShowFilters(!showFilters)}
        />

        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-muted p-4 rounded-lg"
          >
            <span className="text-sm font-medium">
              {selectedItems.length} productos seleccionados
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Exportar Seleccionados
              </Button>
              <Button variant="destructive" size="sm">
                Eliminar Seleccionados
              </Button>
            </div>
          </motion.div>
        )}

        <DataTableProduct
          data={filteredProducts}
          columns={columns}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          emptyMessage="No hay productos disponibles"
          emptyDescription="No se encontraron productos para mostrar"
        />
      </div>
    </main>
  );
}
