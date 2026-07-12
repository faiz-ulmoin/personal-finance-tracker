package com.financetracker.service;

import com.financetracker.model.Transaction;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionService transactionService;

    public byte[] exportCsv() {
        List<Transaction> transactions = transactionService.getAll();
        StringBuilder sb = new StringBuilder("Date,Type,Category,Amount,Note\n");
        for (Transaction tx : transactions) {
            sb.append(tx.getDate()).append(",")
              .append(tx.getType()).append(",")
              .append(tx.getCategory()).append(",")
              .append(tx.getAmount()).append(",")
              .append(tx.getNote() == null ? "" : tx.getNote().replace(",", " ")).append("\n");
        }
        return sb.toString().getBytes();
    }

    public byte[] exportPdf() {
        List<Transaction> transactions = transactionService.getAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (PdfDocument pdfDoc = new PdfDocument(new PdfWriter(out));
             Document document = new Document(pdfDoc)) {

            document.add(new com.itextpdf.layout.element.Paragraph("Personal Finance Tracker — Transaction Report"));

            Table table = new Table(UnitValue.createPercentArray(new float[]{2, 2, 2, 2, 3})).useAllAvailableWidth();
            table.addHeaderCell(new Cell().add(new com.itextpdf.layout.element.Paragraph("Date")));
            table.addHeaderCell(new Cell().add(new com.itextpdf.layout.element.Paragraph("Type")));
            table.addHeaderCell(new Cell().add(new com.itextpdf.layout.element.Paragraph("Category")));
            table.addHeaderCell(new Cell().add(new com.itextpdf.layout.element.Paragraph("Amount")));
            table.addHeaderCell(new Cell().add(new com.itextpdf.layout.element.Paragraph("Note")));

            for (Transaction tx : transactions) {
                table.addCell(tx.getDate().toString());
                table.addCell(tx.getType().toString());
                table.addCell(tx.getCategory());
                table.addCell(String.valueOf(tx.getAmount()));
                table.addCell(tx.getNote() == null ? "" : tx.getNote());
            }
            document.add(table);
        }
        return out.toByteArray();
    }
}
