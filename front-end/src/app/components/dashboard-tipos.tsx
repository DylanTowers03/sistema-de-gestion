import CardsActions from "./cards-actions";
import { tiposActions } from "../../lib/constants";

export default function DashboardTipos() {
  return (
    <>
      <CardsActions
        title="Tipos"
        description="Gestiona los tipos de productos"
        actions={tiposActions}
      />
    </>
  );
}
