package com.propertyplayground.market.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.propertyplayground.market.model.PropertyRecord;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ExportService {
    public byte[] toCsv(List<PropertyRecord> properties) {
        StringBuilder csv = new StringBuilder(
                "id,square_footage,bedrooms,bathrooms,year_built,lot_size,distance_to_city_center,school_rating,price\n");
        properties.forEach(item -> csv.append(String.format(
                "%d,%.0f,%.1f,%.1f,%d,%.0f,%.1f,%.1f,%.2f%n",
                item.id(), item.squareFootage(), item.bedrooms(), item.bathrooms(), item.yearBuilt(),
                item.lotSize(), item.distanceToCityCenter(), item.schoolRating(), item.price())));
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] toPdf(List<PropertyRecord> properties) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, output);
            document.open();
            document.add(new Paragraph("Property Playground — U.S. Suburban Market Export", new Font(Font.HELVETICA, 18, Font.BOLD)));
            document.add(new Paragraph("All property prices are shown in U.S. dollars (USD)."));
            document.add(new Paragraph("Housing market records: " + properties.size()));
            document.add(new Paragraph(" "));
            PdfPTable table = new PdfPTable(new float[] {1, 2, 1, 1, 2, 2});
            table.setWidthPercentage(100);
            for (String heading : List.of("ID", "Price (USD)", "Beds", "Baths", "Area", "School")) {
                table.addCell(new Phrase(heading, new Font(Font.HELVETICA, 9, Font.BOLD)));
            }
            for (PropertyRecord item : properties) {
                table.addCell(String.valueOf(item.id()));
                table.addCell(String.format("$%,.0f", item.price()));
                table.addCell(String.format("%.0f", item.bedrooms()));
                table.addCell(String.format("%.1f", item.bathrooms()));
                table.addCell(String.format("%,.0f ft2", item.squareFootage()));
                table.addCell(String.format("%.1f", item.schoolRating()));
            }
            document.add(table);
            document.close();
            return output.toByteArray();
        } catch (DocumentException | java.io.IOException exception) {
            throw new IllegalStateException("PDF export could not be generated", exception);
        }
    }
}
