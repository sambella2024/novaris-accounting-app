import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export class PDFService {
  static generateDevisPDF(devis: any, lignes: any[], entreprise: any): PassThrough {
    const doc = new PDFDocument();
    const stream = new PassThrough();

    doc.pipe(stream);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('DEVIS', 50, 50);
    doc.fontSize(10).font('Helvetica').text(`Référence: ${devis.reference}`, 50, 80);
    doc.text(`Date: ${new Date(devis.date_devis).toLocaleDateString('fr-FR')}`, 50, 95);

    // Company Info
    doc.fontSize(9).text(entreprise.nom, 50, 130);
    doc.text(entreprise.adresse, 50, 145);
    doc.text(`Tél: ${entreprise.telephone}`, 50, 160);
    doc.text(`Email: ${entreprise.email}`, 50, 175);

    // Client Info
    doc.text('CLIENT:', 350, 130);
    doc.text(devis.client_nom, 350, 145);
    doc.text(devis.client_adresse, 350, 160);
    doc.text(devis.client_telephone, 350, 175);

    // Table Header
    const tableTop = 240;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Référence', 50, tableTop);
    doc.text('Désignation', 140, tableTop);
    doc.text('Quantité', 280, tableTop);
    doc.text('Prix U.', 350, tableTop);
    doc.text('Remise', 420, tableTop);
    doc.text('Montant HT', 480, tableTop);

    // Table Lines
    let yPosition = tableTop + 20;
    doc.fontSize(9).font('Helvetica');
    lignes.forEach((ligne: any) => {
      doc.text(ligne.reference_produit || '', 50, yPosition);
      doc.text(ligne.designation, 140, yPosition);
      doc.text(ligne.quantite.toString(), 280, yPosition);
      doc.text(ligne.prix_unitaire.toString(), 350, yPosition);
      doc.text(ligne.remise_montant.toString(), 420, yPosition);
      doc.text(ligne.montant_ht.toString(), 480, yPosition);
      yPosition += 15;
    });

    // Totals
    yPosition += 20;
    doc.font('Helvetica-Bold');
    doc.text(`Total HT: ${devis.montant_ht}`, 400, yPosition);
    yPosition += 15;
    doc.text(`TVA (20%): ${devis.montant_tva}`, 400, yPosition);
    yPosition += 15;
    doc.text(`Total TTC: ${devis.montant_ttc}`, 400, yPosition);
    yPosition += 20;
    doc.fontSize(11);
    doc.text(`Montant en lettres: ${devis.montant_lettres}`, 50, yPosition);

    doc.end();
    return stream;
  }
}
