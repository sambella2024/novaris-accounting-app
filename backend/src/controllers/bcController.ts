import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { NumerationService } from '../services/numerationService';
import { HistoriqueService } from '../services/historiqueService';
import { PDFService } from '../services/pdfService';

export class BCController {
  static async getBC(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM bons_commande WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'BC not found' });
      }

      const bc = result.rows[0];
      const lignes = await pool.query('SELECT * FROM lignes_bc WHERE bc_id = $1 ORDER BY ordre', [id]);
      const historique = await HistoriqueService.getHistorique('BC', id);

      res.json({ bc, lignes: lignes.rows, historique });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching BC' });
    }
  }

  static async listBC(req: Request, res: Response) {
    try {
      const { statut, page = 1, limit = 20 } = req.query;
      let query = 'SELECT * FROM bons_commande WHERE 1=1';
      const params: any[] = [];

      if (statut) {
        params.push(statut);
        query += ` AND statut = $${params.length}`;
      }

      query += ` ORDER BY date_creation DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ bc: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching BC list' });
    }
  }

  static async validateBC(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userName = `${req.user?.['nom'] || ''} ${req.user?.['prenom'] || ''}`;

      await pool.query(
        `UPDATE bons_commande SET valide_rf = true, date_validation_rf = NOW(), utilisateur_validation_rf = $1, date_modification = NOW()
         WHERE id = $2`,
        [userId, id]
      );

      await HistoriqueService.addHistorique('BC', id, 'Validation du BC', userId!, `Validé par ${userName}`);

      const bc = await pool.query('SELECT * FROM bons_commande WHERE id = $1', [id]);
      res.json({ success: true, bc: bc.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error validating BC' });
    }
  }

  static async transformToFacture(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const userId = req.user?.id;

      // Vérifier que le BC est validé
      const bc = await client.query('SELECT * FROM bons_commande WHERE id = $1', [id]);
      if (!bc.rows[0].valide_rf) {
        return res.status(403).json({ error: 'BC must be validated first' });
      }

      const bcData = bc.rows[0];

      // Créer la facture
      const factureId = uuidv4();
      const factureReference = await NumerationService.getNextFactureReference();

      await client.query(
        `INSERT INTO factures (id, reference, bc_id, devis_id, client_id, client_nom, client_adresse, client_telephone, client_email, representant_id, representant_nom, montant_ht, montant_tva, montant_ttc, net_a_payer, montant_lettres, statut, created_by, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
        [factureId, factureReference, id, bcData.devis_id, bcData.client_id, bcData.client_nom, bcData.client_adresse, bcData.client_telephone, bcData.client_email, bcData.representant_id, bcData.representant_nom, bcData.montant_ht, bcData.montant_tva, bcData.montant_ttc, bcData.net_a_payer, bcData.montant_lettres, 'NON_PAYEE', userId]
      );

      // Copier les lignes
      const lignes = await client.query('SELECT * FROM lignes_bc WHERE bc_id = $1', [id]);
      for (const ligne of lignes.rows) {
        const ligneId = uuidv4();
        await client.query(
          `INSERT INTO lignes_factures (id, facture_id, produit_id, reference_produit, designation, quantite, prix_unitaire, remise_pourcentage, remise_montant, montant_ht, ordre, date_creation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
          [ligneId, factureId, ligne.produit_id, ligne.reference_produit, ligne.designation, ligne.quantite, ligne.prix_unitaire, ligne.remise_pourcentage, ligne.remise_montant, ligne.montant_ht, ligne.ordre]
        );
      }

      // Mettre à jour le statut du BC
      await client.query('UPDATE bons_commande SET statut = $1, date_modification = NOW() WHERE id = $2', ['TRANSFORME', id]);

      await HistoriqueService.addHistorique('BC', id, 'Transformation en Facture', userId!);
      await HistoriqueService.addHistorique('FACTURE', factureId, 'Création de la Facture', userId!);

      await client.query('COMMIT');

      const facture = await pool.query('SELECT * FROM factures WHERE id = $1', [factureId]);
      res.status(201).json({ success: true, facture: facture.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error transforming to Facture:', error);
      res.status(500).json({ error: 'Error transforming to Facture' });
    } finally {
      client.release();
    }
  }

  static async exportPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bc = await pool.query('SELECT * FROM bons_commande WHERE id = $1', [id]);
      const lignes = await pool.query('SELECT * FROM lignes_bc WHERE bc_id = $1 ORDER BY ordre', [id]);
      const entreprise = await pool.query('SELECT * FROM entreprise LIMIT 1');

      if (bc.rows.length === 0) {
        return res.status(404).json({ error: 'BC not found' });
      }

      const bcData = { ...bc.rows[0], titre: 'BON DE COMMANDE' };
      const stream = PDFService.generateDevisPDF(bcData, lignes.rows, entreprise.rows[0]);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=bc-${bc.rows[0].reference}.pdf`);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Error generating PDF' });
    }
  }
}
