// components/form-factura/FacturaClienteSelector.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Client } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useUser } from "./UserContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
interface FacturaClienteSelectorProps {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
}

export function FacturaClienteSelector({
  selectedClient,
  setSelectedClient,
}: FacturaClienteSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const { session } = useUser();

  const { data, error } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => getClients(session?.accessToken || ""),
  });

  useEffect(() => {
    if (data) setClients(data);
  }, [data]);

  useEffect(() => {
    if (error instanceof AxiosError && error.status === 401) {
      toast.error("Sesión expirada. Vuelve a iniciar sesión.");
    }
  }, [error]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      `${client.nombreCliente} ${client.apellidoCliente} ${client.correo}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clients]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente por nombre, apellido o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Clientes disponibles ({clients.length})
          </h3>
          {selectedClient && (
            <Badge variant="outline" className="text-xs">
              Cliente Seleccionado
            </Badge>
          )}
        </div>

        <ScrollArea className="h-[200px] w-full border rounded-md">
          <div className="p-2 space-y-2">
            <AnimatePresence>
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-none shadow-none ${
                      selectedClient?.id === client.id
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-red-900/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm">
                              {client.nombreCliente} {client.apellidoCliente}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {client.correo}
                          </p>
                        </div>
                        {selectedClient?.id === client.id && (
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

            {clients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron clientes</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
