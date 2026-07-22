import { Request, Response } from 'express';
import pool from '../config/database';
import { HistoriqueService } from '../services/historiqueService';
import { PDFService } from '../services/pdfService';

export class FactureController {
  static async getFacture(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM factures WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Facture not found' });
      }

      const facture = result.rows[0];
      const lignes = await pool.query('SELECT * FROM lignes_factures WHERE facture_id = $1 ORDER BY ordre', [id]);
      const historique = await HistoriqueService.getHistorique('FACTURE', id);

      res.json({ facture, lignes: lignes.rows, historique });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Facture' });
    }
  }

  static async listFactures(req: Request, res: Response) {
    try {
      const { statut, page = 1, limit = 20 } = req.query;
      let query = 'SELECT * FROM factures WHERE 1=1';
      const params: any[] = [];

      if (statut) {
        params.push(statut);
        query += ` AND statut = $${params.length}`;
      }

      query += ` ORDER BY date_creation DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ factures: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Factures list' });
    }
  }

  static async validateFacture(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userName = `${req.user?.['nom'] || ''} ${req.user?.['prenom'] || ''}`;

      await pool.query(
        `UPDATE factures SET valide_rf = true, date_validation_rf = NOW(), utilisateur_validation_rf = $1, date_modification = NOW()
         WHERE id = $2`,
        [userId, id]
      );

      await HistoriqueService.addHistorique('FACTURE', id, 'Validation de la Facture', userId!, `Validée par ${userName}`);

      const facture = await pool.query('SELECT * FROM factures WHERE id = $1', [id]);
      res.json({ success: true, facture: facture.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error validating Facture' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const userId = req.user?.id;

      const validStatuts = ['NON_PAYEE', 'PARTIELLEMENT_PAYEE', 'PAYEE'];
      if (!validStatuts.includes(statut)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      await pool.query(
        `UPDATE factures SET statut = $1, date_modification = NOW() WHERE id = $2`,
        [statut, id]
      );

      await HistoriqueService.addHistorique('FACTURE', id, `Statut changé à ${statut}`, userId!);

      const facture = await pool.query('SELECT * FROM factures WHERE id = $1', [id]);
      res.json({ success: true, facture: facture.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error updating Facture status' });
    }
  }

  static async exportPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const facture = await pool.query('SELECT * FROM factures WHERE id = $1', [id]);
      const lignes = await pool.query('SELECT * FROM lignes_factures WHERE facture_id = $1 ORDER BY ordre', [id]);
      const entreprise = await pool.query('SELECT * FROM entreprise LIMIT 1');

      if (facture.rows.length === 0) {
        return res.status(404).json({ error: 'Facture not found' });
      }

      const factureData = { ...facture.rows[0], titre: 'FACTURE' };
      const stream = PDFService.generateDevisPDF(factureData, lignes.rows, entreprise.rows[0]);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=facture-${facture.rows[0].reference}.pdf`);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Error generating PDF' });
    }
  }
}
