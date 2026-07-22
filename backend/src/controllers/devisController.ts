import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { NumerationService } from '../services/numerationService';
import { CalculService } from '../services/calculService';
import { HistoriqueService } from '../services/historiqueService';
import { PDFService } from '../services/pdfService';

export class DevisController {
  static async createDevis(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { client_id, date_devis, date_livraison, representant_id, echeance, lignes } = req.body;
      const devisId = uuidv4();
      const reference = await NumerationService.getNextDevisReference();
      const userId = req.user?.id;

      // Créer le devis
      await client.query(
        `INSERT INTO devis (id, reference, date_devis, date_livraison, client_id, representant_id, echeance, statut, created_by, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [devisId, reference, date_devis, date_livraison, client_id, representant_id, echeance, 'BROUILLON', userId]
      );

      // Récupérer les infos client
      const clientResult = await client.query('SELECT * FROM clients WHERE id = $1', [client_id]);
      const clientData = clientResult.rows[0];

      // Insérer les lignes et calculer les totaux
      let totalHT = 0;
      for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligneId = uuidv4();
        const montantHT = CalculService.calculateLineAmount(
          ligne.quantite,
          ligne.prix_unitaire,
          ligne.remise || 0,
          ligne.isRemisePercentage !== false
        );
        totalHT += montantHT;

        await client.query(
          `INSERT INTO lignes_devis (id, devis_id, produit_id, designation, quantite, prix_unitaire, remise_pourcentage, remise_montant, montant_ht, ordre, date_creation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [ligneId, devisId, ligne.produit_id, ligne.designation, ligne.quantite, ligne.prix_unitaire, ligne.remise_pourcentage || 0, ligne.remise_montant || 0, montantHT, i + 1]
        );
      }

      // Calculer les totaux
      const { montantTVA, totalTTC } = CalculService.calculateTotals(
        lignes.map((l: any) => ({
          montant_ht: CalculService.calculateLineAmount(l.quantite, l.prix_unitaire, l.remise || 0, l.isRemisePercentage !== false)
        }))
      );

      const montantLettres = CalculService.convertNumberToLetters(Math.floor(totalTTC));

      // Mettre à jour les totaux
      await client.query(
        `UPDATE devis SET montant_ht = $1, montant_tva = $2, montant_ttc = $3, net_a_payer = $4, montant_lettres = $5, date_modification = NOW()
         WHERE id = $6`,
        [totalHT, montantTVA, totalTTC, totalTTC, montantLettres, devisId]
      );

      // Ajouter à l'historique
      await HistoriqueService.addHistorique('DEVIS', devisId, 'Création du devis', userId!);

      await client.query('COMMIT');

      const devis = await pool.query('SELECT * FROM devis WHERE id = $1', [devisId]);
      res.status(201).json({ success: true, devis: devis.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating devis:', error);
      res.status(500).json({ error: 'Error creating devis' });
    } finally {
      client.release();
    }
  }

  static async getDevis(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM devis WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Devis not found' });
      }

      const devis = result.rows[0];
      const lignes = await pool.query('SELECT * FROM lignes_devis WHERE devis_id = $1 ORDER BY ordre', [id]);
      const historique = await HistoriqueService.getHistorique('DEVIS', id);

      res.json({ devis, lignes: lignes.rows, historique });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching devis' });
    }
  }

  static async listDevis(req: Request, res: Response) {
    try {
      const { statut, client_id, page = 1, limit = 20 } = req.query;
      let query = 'SELECT * FROM devis WHERE 1=1';
      const params: any[] = [];

      if (statut) {
        params.push(statut);
        query += ` AND statut = $${params.length}`;
      }

      if (client_id) {
        params.push(client_id);
        query += ` AND client_id = $${params.length}`;
      }

      query += ` ORDER BY date_creation DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ devis: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching devis list' });
    }
  }

  static async updateDevis(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const { date_livraison, echeance, lignes } = req.body;
      const userId = req.user?.id;

      // Vérifier que le devis n'est pas validé
      const devisCheck = await client.query('SELECT * FROM devis WHERE id = $1', [id]);
      if (devisCheck.rows[0].valide_rf) {
        return res.status(403).json({ error: 'Cannot modify a validated devis' });
      }

      // Supprimer les anciennes lignes
      await client.query('DELETE FROM lignes_devis WHERE devis_id = $1', [id]);

      // Ajouter les nouvelles lignes
      let totalHT = 0;
      for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligneId = uuidv4();
        const montantHT = CalculService.calculateLineAmount(
          ligne.quantite,
          ligne.prix_unitaire,
          ligne.remise || 0,
          ligne.isRemisePercentage !== false
        );
        totalHT += montantHT;

        await client.query(
          `INSERT INTO lignes_devis (id, devis_id, produit_id, designation, quantite, prix_unitaire, remise_pourcentage, remise_montant, montant_ht, ordre, date_creation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [ligneId, id, ligne.produit_id, ligne.designation, ligne.quantite, ligne.prix_unitaire, ligne.remise_pourcentage || 0, ligne.remise_montant || 0, montantHT, i + 1]
        );
      }

      // Calculer les totaux
      const { montantTVA, totalTTC } = CalculService.calculateTotals(
        lignes.map((l: any) => ({
          montant_ht: CalculService.calculateLineAmount(l.quantite, l.prix_unitaire, l.remise || 0, l.isRemisePercentage !== false)
        }))
      );

      const montantLettres = CalculService.convertNumberToLetters(Math.floor(totalTTC));

      // Mettre à jour le devis
      await client.query(
        `UPDATE devis SET date_livraison = $1, echeance = $2, montant_ht = $3, montant_tva = $4, montant_ttc = $5, net_a_payer = $6, montant_lettres = $7, date_modification = NOW()
         WHERE id = $8`,
        [date_livraison, echeance, totalHT, montantTVA, totalTTC, totalTTC, montantLettres, id]
      );

      await HistoriqueService.addHistorique('DEVIS', id, 'Modification du devis', userId!);
      await client.query('COMMIT');

      const devis = await pool.query('SELECT * FROM devis WHERE id = $1', [id]);
      res.json({ success: true, devis: devis.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Error updating devis' });
    } finally {
      client.release();
    }
  }

  static async validateDevis(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userName = `${req.user?.['nom'] || ''} ${req.user?.['prenom'] || ''}`;

      await pool.query(
        `UPDATE devis SET valide_rf = true, date_validation_rf = NOW(), utilisateur_validation_rf = $1, date_modification = NOW()
         WHERE id = $2`,
        [userId, id]
      );

      await HistoriqueService.addHistorique('DEVIS', id, 'Validation du devis', userId!, `Validé par ${userName}`);

      const devis = await pool.query('SELECT * FROM devis WHERE id = $1', [id]);
      res.json({ success: true, devis: devis.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error validating devis' });
    }
  }

  static async transformToBC(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const userId = req.user?.id;

      // Vérifier que le devis est validé
      const devis = await client.query('SELECT * FROM devis WHERE id = $1', [id]);
      if (!devis.rows[0].valide_rf) {
        return res.status(403).json({ error: 'Devis must be validated first' });
      }

      const devisData = devis.rows[0];

      // Créer le BC
      const bcId = uuidv4();
      const bcReference = await NumerationService.getNextBCReference();

      await client.query(
        `INSERT INTO bons_commande (id, reference, devis_id, client_id, client_nom, client_adresse, client_telephone, client_email, representant_id, representant_nom, montant_ht, montant_tva, montant_ttc, net_a_payer, montant_lettres, statut, created_by, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())`,
        [bcId, bcReference, id, devisData.client_id, devisData.client_nom, devisData.client_adresse, devisData.client_telephone, devisData.client_email, devisData.representant_id, devisData.representant_nom, devisData.montant_ht, devisData.montant_tva, devisData.montant_ttc, devisData.net_a_payer, devisData.montant_lettres, 'EN_ATTENTE', userId]
      );

      // Copier les lignes
      const lignes = await client.query('SELECT * FROM lignes_devis WHERE devis_id = $1', [id]);
      for (const ligne of lignes.rows) {
        const ligneId = uuidv4();
        await client.query(
          `INSERT INTO lignes_bc (id, bc_id, produit_id, reference_produit, designation, quantite, prix_unitaire, remise_pourcentage, remise_montant, montant_ht, ordre, date_creation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
          [ligneId, bcId, ligne.produit_id, ligne.reference_produit, ligne.designation, ligne.quantite, ligne.prix_unitaire, ligne.remise_pourcentage, ligne.remise_montant, ligne.montant_ht, ligne.ordre]
        );
      }

      // Mettre à jour le statut du devis
      await client.query('UPDATE devis SET statut = $1, date_modification = NOW() WHERE id = $2', ['TRANSFORME', id]);

      await HistoriqueService.addHistorique('DEVIS', id, 'Transformation en Bon de Commande', userId!);
      await HistoriqueService.addHistorique('BC', bcId, 'Création du Bon de Commande', userId!);

      await client.query('COMMIT');

      const bc = await pool.query('SELECT * FROM bons_commande WHERE id = $1', [bcId]);
      res.status(201).json({ success: true, bc: bc.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error transforming to BC:', error);
      res.status(500).json({ error: 'Error transforming to BC' });
    } finally {
      client.release();
    }
  }

  static async exportPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const devis = await pool.query('SELECT * FROM devis WHERE id = $1', [id]);
      const lignes = await pool.query('SELECT * FROM lignes_devis WHERE devis_id = $1 ORDER BY ordre', [id]);
      const entreprise = await pool.query('SELECT * FROM entreprise LIMIT 1');

      if (devis.rows.length === 0) {
        return res.status(404).json({ error: 'Devis not found' });
      }

      const stream = PDFService.generateDevisPDF(devis.rows[0], lignes.rows, entreprise.rows[0]);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=devis-${devis.rows[0].reference}.pdf`);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Error generating PDF' });
    }
  }
}
