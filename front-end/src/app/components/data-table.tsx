"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";
import type { Product } from "@/types/types";

export interface Column {
  key: string;
  label: string;
  render?: (item: Product) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps {
  data: Product[];
  columns: Column[];
  selectedItems?: Product[];
  onSelectionChange?: (products: Product[]) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DataTable({
  data,
  columns,
  selectedItems = [],
  onSelectionChange,
  emptyMessage = "No hay datos disponibles",
  emptyDescription = "No se encontraron elementos para mostrar",
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  console.log(data);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? data : []);
    }
  };

  const handleSelectItem = (item: Product, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedItems, item]
        : selectedItems.filter((elem) => elem.id !== item.id);
      onSelectionChange(newSelection);
    }
  };

  const isAllSelected = selectedItems.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < data.length;

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
            <p className="text-muted-foreground">{emptyDescription}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {onSelectionChange && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(ref) => {
                          if (ref && "indeterminate" in ref) {
                            (ref as HTMLInputElement).indeterminate =
                              isIndeterminate;
                          }
                        }}
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={`${column.width || ""} ${
                        column.sortable
                          ? "cursor-pointer hover:bg-muted/50"
                          : ""
                      }`}
                      onClick={() =>
                        column.sortable && handleSort(String(column.key))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.label}</span>
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {onSelectionChange && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render
                            ? column.render(item)
                            : String(item.nombreProducto || "-")}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
