"use client";
import { DashboardSidebar } from "@/app/components/dashboard-sidebar";
import { useUser } from "@/app/components/UserContext";
export default function NegociosDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useUser();

  if (!session?.user?.roles.includes("SuperAdmin")) {
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
        <DashboardSidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </>
  );
}
