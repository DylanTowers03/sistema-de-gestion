import FacturaForm from "@/app/components/FacturaForm";

export default function InvoicesCreateDashboardPage({}) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Dashboard de Facturas
      </h1>
      <p className="text-muted-foreground mt-2">
        Administra y controla todas las facturas de tu negocio
      </p>
      {/* Aquí puedes agregar más contenido relacionado con las facturas */}
      <div className="mt-8">
        <FacturaForm />
      </div>
    </div>
  );
}
