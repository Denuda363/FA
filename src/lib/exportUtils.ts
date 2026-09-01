import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MonthlyReportData, INCOME_CATEGORIES, EXPENSE_CASH_CATEGORIES, EXPENSE_TF_CATEGORIES, CompanyProfile } from '../types';
import { formatRupiah } from './utils';

export function exportToPDF(data: MonthlyReportData, profile: CompanyProfile) {
  const doc = new jsPDF();

  // KOP SURAT
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text(profile.name, 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(profile.address, 14, 28);
  doc.text(`Telp: ${profile.phone}  |  Email: ${profile.email}`, 14, 34);

  // Divider Line
  doc.setLineWidth(0.5);
  doc.setDrawColor(30, 58, 138);
  doc.line(14, 38, 196, 38);
  doc.setLineWidth(1.5);
  doc.line(14, 39.5, 196, 39.5);

  // REPORT TITLE
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`LAPORAN KEUANGAN - ${data.month.toUpperCase()} ${data.year}`, 14, 52);
  
  const tableData: any[][] = [];

  // Income Bruto
  tableData.push(['INCOME BRUTO', '', '']);
  INCOME_CATEGORIES.forEach(cat => {
    tableData.push([`  . ${cat}`, formatRupiah(data.income[cat] || 0), '']);
  });
  tableData.push(['TOTAL INCOME BRUTO', '', formatRupiah(data.totalIncomeBruto)]);
  tableData.push(['', '', '']); // Spacer

  // Pengeluaran Cash
  tableData.push(['PENGELUARAN CASH', '', '']);
  EXPENSE_CASH_CATEGORIES.forEach(cat => {
    tableData.push([`  . ${cat}`, formatRupiah(data.expenseCash[cat] || 0), '']);
  });
  tableData.push(['TOTAL PENGELUARAN CASH', '', formatRupiah(data.totalExpenseCash)]);
  tableData.push(['', '', '']); // Spacer

  // Pengeluaran TF
  tableData.push(['PENGELUARAN TF', '', '']);
  EXPENSE_TF_CATEGORIES.forEach(cat => {
    tableData.push([`  . ${cat}`, formatRupiah(data.expenseTF[cat] || 0), '']);
  });
  tableData.push(['TOTAL PENGELUARAN TF', '', formatRupiah(data.totalExpenseTF)]);
  tableData.push(['', '', '']); // Spacer

  // Summary
  tableData.push(['PROFIT PERUSAHAAN (15%)', '', formatRupiah(data.profitPerusahaan)]);
  tableData.push(['PROFIT OWNER (20% dr Profit Perusahaan)', '', formatRupiah(data.profitOwner)]);
  tableData.push(['INCOME NETO', '', formatRupiah(data.incomeNeto)]);

  autoTable(doc, {
    startY: 60,
    head: [['Deskripsi', 'Nominal', 'Sub-Total / Total']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 4, textColor: [51, 65, 85] },
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    didParseCell: (data) => {
      // Bold headers and totals
      if (
        data.cell.text[0].startsWith('TOTAL') ||
        data.cell.text[0].startsWith('INCOME BRUTO') ||
        data.cell.text[0].startsWith('PENGELUARAN') ||
        data.cell.text[0].startsWith('PROFIT') ||
        data.cell.text[0].startsWith('INCOME NETO')
      ) {
        data.cell.styles.fontStyle = 'bold';
        if (data.cell.text[0].startsWith('INCOME NETO')) {
          data.cell.styles.fontSize = 11;
          data.cell.styles.textColor = [15, 23, 42];
          data.cell.styles.fillColor = [241, 245, 249];
        }
      }
    }
  });

  doc.save(`Laporan_Keuangan_${data.month}_${data.year}.pdf`);
}

export function exportToExcel(data: MonthlyReportData, profile: CompanyProfile) {
  const rows: any[] = [];
  
  // Kop Surat
  rows.push({ Deskripsi: profile.name.toUpperCase(), Nominal: '', Total: '' });
  rows.push({ Deskripsi: profile.address, Nominal: '', Total: '' });
  rows.push({ Deskripsi: `Telp: ${profile.phone} | Email: ${profile.email}`, Nominal: '', Total: '' });
  rows.push({});
  
  rows.push({ Deskripsi: `LAPORAN KEUANGAN - ${data.month.toUpperCase()} ${data.year}`, Nominal: '', Total: '' });
  rows.push({});

  rows.push({ Deskripsi: 'INCOME BRUTO', Nominal: '', Total: '' });
  INCOME_CATEGORIES.forEach(cat => {
    rows.push({ Deskripsi: `  . ${cat}`, Nominal: formatRupiah(data.income[cat] || 0), Total: '' });
  });
  rows.push({ Deskripsi: 'TOTAL INCOME BRUTO', Nominal: '', Total: formatRupiah(data.totalIncomeBruto) });
  rows.push({});

  rows.push({ Deskripsi: 'PENGELUARAN CASH', Nominal: '', Total: '' });
  EXPENSE_CASH_CATEGORIES.forEach(cat => {
    rows.push({ Deskripsi: `  . ${cat}`, Nominal: formatRupiah(data.expenseCash[cat] || 0), Total: '' });
  });
  rows.push({ Deskripsi: 'TOTAL PENGELUARAN CASH', Nominal: '', Total: formatRupiah(data.totalExpenseCash) });
  rows.push({});

  rows.push({ Deskripsi: 'PENGELUARAN TF', Nominal: '', Total: '' });
  EXPENSE_TF_CATEGORIES.forEach(cat => {
    rows.push({ Deskripsi: `  . ${cat}`, Nominal: formatRupiah(data.expenseTF[cat] || 0), Total: '' });
  });
  rows.push({ Deskripsi: 'TOTAL PENGELUARAN TF', Nominal: '', Total: formatRupiah(data.totalExpenseTF) });
  rows.push({});

  rows.push({ Deskripsi: 'PROFIT PERUSAHAAN (15%)', Nominal: '', Total: formatRupiah(data.profitPerusahaan) });
  rows.push({ Deskripsi: 'PROFIT OWNER (20% dr Profit Perusahaan)', Nominal: '', Total: formatRupiah(data.profitOwner) });
  rows.push({ Deskripsi: 'INCOME NETO', Nominal: '', Total: formatRupiah(data.incomeNeto) });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

  XLSX.writeFile(wb, `Laporan_Keuangan_${data.month}_${data.year}.xlsx`);
}
