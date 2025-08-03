import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

interface DetalleFactura {
  producto: string;
  cantidad: number;
  subtotal: string;
}

interface Factura {
  cliente: string;
  fecha: string;
  consecutivo: string;
  total: string;
  detalles: DetalleFactura[];
}

export async function generarFacturaPDF(factura: Factura) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();

  let y = 800;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 12,
    bold = false
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
  };

  // 🧾 Encabezado
  drawText("FACTURA ELECTRONICA", 200, y, 20, true);
  y -= 40;

  // 📇 Info general
  drawText(`Cliente: ${factura.cliente}`, 50, y);
  drawText(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 350, y);
  y -= 20;
  drawText(`Consecutivo: ${factura.consecutivo}`, 50, y);
  drawText(`Estado: Generada`, 350, y);
  y -= 30;

  // Línea separadora
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 20;

  // 🧾 Encabezado tabla
  drawText("Producto", 50, y, 12, true);
  drawText("Cantidad", 280, y, 12, true);
  drawText("Subtotal", 420, y, 12, true);
  y -= 10;

  // Línea inferior del encabezado
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 20;

  // 🧮 Tabla de productos
  factura.detalles.forEach((detalle) => {
    drawText(detalle.producto, 50, y);
    drawText(detalle.cantidad.toString(), 280, y);
    drawText(`$${detalle.subtotal}`, 420, y);
    y -= 20;
  });

  y -= 20;

  // Línea encima del total
  page.drawLine({
    start: { x: 300, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 20;

  // 💰 Total
  drawText("TOTAL:", 300, y, 14, true);
  drawText(`$${factura.total}`, 420, y, 14, true);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, `factura-${factura.consecutivo}.pdf`);
}
