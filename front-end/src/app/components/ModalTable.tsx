import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Column, DataTable } from "./DataTable";
import { DataSearchFilter } from "./data-search-filter";
interface ModalTableProps<T> {
  isOpen: boolean;
  onClose: () => void;
  section: "clientes" | "proveedores" | "negocios";
  filteredData: T[];
  columns: Column<T>[];
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
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
  searchValue,
  onSearchChange,
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

          <DataSearchFilter
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filters={[]}
            activeFilters={{}}
            onFilterChange={() => {}}
            onClearFilters={() => {}}
            showAdvancedFilters={false}
            onToggleAdvancedFilters={() => {}}
          />
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
