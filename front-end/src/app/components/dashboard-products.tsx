"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { stats, productActions } from "@/lib/constants";
import CardsActions from "@/app/components/cards-actions";
export function DashboardProducts() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Productos
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra y controla todos los productos de tu negocio
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Productos Activos
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
        <CardsActions
          title="Productos"
          description="Opciones disponibles para gestionar los productos en el sistema."
          actions={productActions}
        />
      </motion.div>
    </>
  );
}
