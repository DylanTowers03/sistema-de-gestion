"use client";
import CardsClientesActions from "@/app/components/card-clientes-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { clientesActions, clienteStats } from "@/lib/constants";
import { motion } from "motion/react";

export default function ClientesPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion de Clientes
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra y controla todos los clientes de tu negocio
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Clientes Activos
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {clienteStats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> desde el
                  mes pasado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <CardsClientesActions
          title="Clientes"
          description="Opciones disponibles para gestionar los clientes en el sistema."
          actions={clientesActions}
        />
      </motion.div>
    </>
  );
}
