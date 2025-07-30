"use client";
import CardsNegociosActions from "@/app/components/card-negocios-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { negociosActions, negocioStats } from "@/lib/constants";
import { motion } from "motion/react";

export default function NegociosPage() {
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
              Gestion de Negocios
            </h1>
            <p className="text-muted-foreground mt-2">
              Administra y controla todos los negocios de tu plataforma
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Negocios Activos
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {negocioStats.map((stat) => (
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
        <CardsNegociosActions
          title="Negocios"
          description="Gestiona los negocios de tu plataforma."
          actions={negociosActions}
        />
      </motion.div>
    </>
  );
}
