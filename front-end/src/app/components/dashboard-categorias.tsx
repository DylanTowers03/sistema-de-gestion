import CardsActions from "./cards-products-actions";
import { categoriasActions } from "../../lib/constants";

export default function DashboardCategorias() {
  return (
    <>
      <CardsActions
        title="Categorias"
        description="Gestiona las categorias de los productos"
        actions={categoriasActions}
      />
    </>
  );
}
