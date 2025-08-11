"use client";
import { Sidebar } from "@/app/components/DashboardSidebarGeneric";
import { useUser } from "@/app/components/UserContext";
import { Home } from "lucide-react";
const items = [
  {
    title: "Mi Negocio",
    href: "/dashboard/minegocio/edit/",
    icon: Home,
  },
  {
    title: "empleados",
    href: "/dashboard/minegocio/employees/",
    icon: Home,
  },
];
export default function MiNegocioDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useUser();

  const roles = session?.user?.roles ?? [];

  if (!roles.includes("Admin") && !roles.includes("SuperAdmin")) {
    return (
      <>
        <main className="flex-1">
          <h1>Acceso Denegado</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <aside className="hidden md:block border-r bg-muted/10">
        <Sidebar items={items} defaultActive="Mi Negocio" />
      </aside>
      <main className="flex-1">{children}</main>
    </>
  );
}
