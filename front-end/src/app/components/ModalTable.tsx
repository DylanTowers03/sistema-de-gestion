import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Column, DataTable } from "./DataTable";

interface ModalTableProps<T> {
  isOpen: boolean;
  onClose: () => void;
  section: "clientes";
  filteredData: T[];
  columns: Column<T>[];
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ModalTable<T>({
  isOpen,
  onClose,
  section,
  filteredData,
  columns,
  selectedItems,
  onSelectionChange,
  emptyMessage,
  emptyDescription,
}: ModalTableProps<T>) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tabla de {section}</DialogTitle>
            <DialogDescription>
              Aquí puedes ver y gestionar los datos de los {section}.
            </DialogDescription>
          </DialogHeader>
          {/* Aquí iría la tabla con los datos */}
          <DataTable
            data={filteredData}
            columns={columns}
            selectedItems={selectedItems}
            onSelectionChange={onSelectionChange}
            emptyMessage={emptyMessage}
            emptyDescription={emptyDescription}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
