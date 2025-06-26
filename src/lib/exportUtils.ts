import { Property } from '@/types/RealEstate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = async (properties: Property[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Property Report', 20, 20);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Total Properties: ${properties.length}`, 20, 40);
  
  // Prepare table data
  const tableData = properties.map(property => [
    property.propertyaddress || 'N/A',
    property.propertycity || 'N/A',
    property.saleprice ? `$${property.saleprice.toLocaleString()}` : 'N/A',
    property.saledate || 'N/A',
    property.finishedlivingarea || 'N/A',
    property.schooldesc || 'N/A'
  ]);
  
  // Add table
  doc.autoTable({
    head: [['Address', 'City', 'Sale Price', 'Sale Date', 'Sq Ft', 'School District']],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Save the PDF
  doc.save(`property-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Placeholder for future Word export
export const generateWord = async (properties: Property[]) => {
  // TODO: Implement Word document generation
  console.log('Word export not yet implemented');
};

// Placeholder for future Excel export
export const generateExcel = async (properties: Property[]) => {
  // TODO: Implement Excel spreadsheet generation
  console.log('Excel export not yet implemented');
};