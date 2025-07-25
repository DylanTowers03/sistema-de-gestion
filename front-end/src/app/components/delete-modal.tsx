"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Trash2,
  Package,
  X,
  Loader2,
  DollarSign,
  Hash,
  User,
} from "lucide-react";
import type { Product, Tipos, Categorias, Client } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategorias, getTipos, getClients } from "@/lib/api";
import { useUser } from "./UserContext";
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: "productos" | "tipos" | "categorias" | "clientes";
  onDelete: (id: string) => Promise<void>;
}

export function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  section,
}: DeleteModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    Product | Tipos | Categorias | Client | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<
    Product[] | Tipos[] | Categorias[] | Client[]
  >([]);
  const { session } = useUser();

  const { data: queryData } = useQuery<
    Product[] | Tipos[] | Categorias[] | Client[]
  >({
    queryKey: [section],
    queryFn: () => {
      if (section === "productos") {
        return getProducts(session?.accessToken || "");
      }
      if (section === "tipos") {
        return getTipos(session?.accessToken || "");
      }
      if (section === "categorias") {
        return getCategorias(session?.accessToken || "");
      }
      if (section === "clientes") {
        return getClients(session?.accessToken || "");
      }
      return [];
    },
  });

  useEffect(() => {
    if (queryData) {
      console.log(queryData);

      setData(queryData);
    }
  }, [queryData]);

  function isProductArray(
    data: Product[] | Tipos[] | Categorias[] | Client[]
  ): data is Product[] {
    return data.length > 0 && "nombreProducto" in data[0];
  }

  function isTipoArray(
    data: Tipos[] | Categorias[] | Product[] | Client[]
  ): data is Tipos[] {
    return data.length > 0 && "nombreTipoProducto" in data[0];
  }

  function isCategoriaArray(
    data: Categorias[] | Product[] | Tipos[] | Client[]
  ): data is Categorias[] {
    return data.length > 0 && "nombreCategoria" in data[0];
  }

  function isClientArray(
    data: Client[] | Product[] | Tipos[] | Categorias[]
  ): data is Client[] {
    return data.length > 0 && "nombreCliente" in data[0];
  }

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    if (isProductArray(data)) {
      return data.filter((item) =>
        item.nombreProducto.toLowerCase().includes(lowerSearch)
      );
    }

    if (isTipoArray(data)) {
      return data.filter((item) =>
        item.nombreTipoProducto.toLowerCase().includes(lowerSearch)
      );
    }

    if (isCategoriaArray(data)) {
      return data.filter((item) =>
        item.nombreCategoria.toLowerCase().includes(lowerSearch)
      );
    }

    if (isClientArray(data)) {
      console.log("isClientArray", data);

      return data.filter((item) => {
        return (
          item.nombreCliente.toLowerCase().includes(lowerSearch) ||
          item.apellidoCliente.toString().includes(lowerSearch)
        );
      });
    }

    return [];
  }, [searchTerm, data]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedItem.id);
      setSelectedItem(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Eliminar {section}
              </DialogTitle>
              <DialogDescription>
                Selecciona el {section} que deseas eliminar del sistema
              </DialogDescription>
            </div>
          </div>
          <Badge variant="destructive" className="w-fit">
            Acción Irreversible
          </Badge>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar por nombre o ID del ${section}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {section} Disponibles ({filteredData.length})
              </h3>
              {selectedItem && (
                <Badge variant="outline" className="text-xs">
                  {section} Seleccionado
                </Badge>
              )}
            </div>

            <ScrollArea className="h-[152px] w-full border rounded-md">
              <div className="p-4 space-y-2">
                <AnimatePresence>
                  {isProductArray(filteredData) &&
                    filteredData.map((el) => (
                      <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedItem?.id === el.id
                              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(el)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {el.nombreProducto}
                                  </h4>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                  {el.descripcion}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Hash className="h-3 w-3" />
                                    <span>ID: {el.id}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>${el.precioVenta}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    Stock: {el.stockActual}
                                  </Badge>
                                </div>
                              </div>
                              {selectedItem?.id === el.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  {isTipoArray(filteredData) &&
                    filteredData.map((el) => (
                      <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedItem?.id === el.id
                              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(el)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {el.nombreTipoProducto}
                                  </h4>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Hash className="h-3 w-3" />
                                    <span>ID: {el.id}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedItem?.id === el.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  {isCategoriaArray(filteredData) &&
                    filteredData.map((el) => (
                      <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedItem?.id === el.id
                              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(el)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {el.nombreCategoria}
                                  </h4>
                                </div>

                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Hash className="h-3 w-3" />
                                    <span>ID: {el.id}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedItem?.id === el.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  {isClientArray(filteredData) &&
                    filteredData.map((el) => (
                      <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedItem?.id === el.id
                              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(el)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium text-sm">
                                    {el.nombreCliente} {el.apellidoCliente}
                                  </h4>
                                </div>

                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Hash className="h-3 w-3" />
                                    <span>ID: {el.id}</span>
                                  </div>
                                </div>
                              </div>
                              {selectedItem?.id === el.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2"
                                >
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No se encontraron productos</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!selectedItem || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Eliminar {section}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
