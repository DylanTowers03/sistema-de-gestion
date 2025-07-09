"use client";

import { useDashboardWindow } from "@/app/components/DashboardWindowProvider";
import React from "react";
import { DashboardProducts } from "@/app/components/dashboard-products";
import DashboardTipos from "@/app/components/dashboard-tipos";
import DashboardCategorias from "@/app/components/dashboard-categorias";
export default function DashboardPage() {
  const { whatIsOpen } = useDashboardWindow();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {whatIsOpen === "productos" && <DashboardProducts />}
      {whatIsOpen === "tipos" && <DashboardTipos />}
      {whatIsOpen === "categorias" && <DashboardCategorias />}
    </div>
  );
}
