import { DashboardSidebar } from "@/app/components/dashboard-sidebar";
export default async function HomeDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <aside className="hidden md:block border-r bg-muted/10">
        <DashboardSidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </>
  );
}
