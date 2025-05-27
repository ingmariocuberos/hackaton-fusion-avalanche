import jsPDF from "jspdf";
import type { Category, Subcategory, Incentive } from '../../interfaces/contentItem.interface';
import plantilla from '../../assets/motivacion-plantillas.jpg';

export const createMotivationalPDF = (pdfContent: string, subcategory: Subcategory, category: Category, incentives: Incentive[]): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 30;
  const marginRight = 30;
  const marginTop = 30;
  const marginBottom = 30;
  const usableWidth = pageWidth - marginLeft - marginRight;
  let cursorY = marginTop;

  const img = new Image();
  img.src = plantilla;

  img.onload = function () {
    // Fondo en la primera página
    doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);

    cursorY = marginTop;

    // Título principal
    doc.setFontSize(20);
    doc.text(subcategory.title, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 15;

    // Categoría
    doc.setFontSize(14);
    doc.text(`Categoría: ${category.title}`, marginLeft, cursorY);
    cursorY += 10;

    // Descripción
    doc.setFontSize(12);
    doc.text('Descripción:', marginLeft, cursorY);
    cursorY += 7;
    const descLines = doc.splitTextToSize(subcategory.description, usableWidth);
    doc.text(descLines, marginLeft, cursorY);
    cursorY += descLines.length * 7 + 5;

    // Incentivos
    doc.setFontSize(12);
    doc.text('Incentivos:', marginLeft, cursorY);
    cursorY += 7;

    incentives.forEach(item => {
      doc.text(`- ${item.label}: ${item.value} AVAX`, marginLeft + 5, cursorY);
      cursorY += 7;
    });
    cursorY += 5;

    // Contenido generado por Groq
    doc.setFontSize(14);
    doc.text('Contenido:', marginLeft, cursorY);
    cursorY += 10;
    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(pdfContent, usableWidth);
    const lineHeight = 7;

    contentLines.forEach((line: string) => {
      if (cursorY + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        doc.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
        cursorY = marginTop;
      }
      doc.text(line, marginLeft, cursorY);
      cursorY += lineHeight;
    });
  }

  return doc.output("blob");
}