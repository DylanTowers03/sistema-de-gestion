import { InvoicesSidebar } from "@/app/components/InvoicesSidebar";

export default async function InvoicesDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <aside className="hidden md:block border-r bg-muted/10">
        <InvoicesSidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </>
  );
}
