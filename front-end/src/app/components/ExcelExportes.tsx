"use client";

import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

type ExcelExporterProps<T> = {
  data: T[];
  fileName?: string;
  buttonLabel?: string;
};

export function ExcelExporter<T extends Record<string, any>>({
  data,
  fileName = "export",
  buttonLabel = "Exportar",
}: ExcelExporterProps<T>) {
  const handleExport = async () => {
    try {
      // 1. Convertir los datos a una hoja de Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 2. Generar el buffer del archivo
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 3. Pedir al usuario una ubicación y nombre de archivo
      if ("showSaveFilePicker" in window) {
        const opts = {
          suggestedName: `${fileName}.xlsx`,
          types: [
            {
              description: "Excel Files",
              accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
              },
            },
          ],
        };

        // @ts-ignore
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(new Blob([excelBuffer]));
        await writable.close();
      } else {
        // fallback para navegadores que no soportan File System Access API
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
      }
    } catch (error) {
      console.error("Error al exportar el archivo Excel:", error);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={"outline"}
      size="sm"
      className="gap-2 cursor-pointer"
    >
      {buttonLabel}
    </Button>
  );
}
