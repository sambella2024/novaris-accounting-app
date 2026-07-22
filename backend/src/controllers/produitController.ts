import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class ProduitController {
  static async createProduit(req: Request, res: Response) {
    try {
      const { reference, designation, prix_unitaire, unite, categorie, tva } = req.body;
      const produitId = uuidv4();

      await pool.query(
        `INSERT INTO produits (id, reference, designation, prix_unitaire, unite, categorie, tva, actif, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
        [produitId, reference, designation, prix_unitaire, unite, categorie, tva || 20]
      );

      const produit = await pool.query('SELECT * FROM produits WHERE id = $1', [produitId]);
      res.status(201).json({ success: true, produit: produit.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error creating produit' });
    }
  }

  static async listProduits(req: Request, res: Response) {
    try {
      const { categorie, actif = true, search, page = 1, limit = 50 } = req.query;
      let query = 'SELECT * FROM produits WHERE 1=1';
      const params: any[] = [];

      if (actif !== undefined) {
        params.push(actif === 'true');
        query += ` AND actif = $${params.length}`;
      }

      if (categorie) {
        params.push(categorie);
        query += ` AND categorie = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (reference ILIKE $${params.length} OR designation ILIKE $${params.length})`;
      }

      query += ` ORDER BY designation ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ produits: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching produits' });
    }
  }

  static async getProduit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produit not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching produit' });
    }
  }

  static async updateProduit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { designation, prix_unitaire, unite, categorie, tva, actif } = req.body;

      await pool.query(
        `UPDATE produits SET designation = $1, prix_unitaire = $2, unite = $3, categorie = $4, tva = $5, actif = $6, date_modification = NOW()
         WHERE id = $7`,
        [designation, prix_unitaire, unite, categorie, tva, actif, id]
      );

      const produit = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
      res.json({ success: true, produit: produit.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error updating produit' });
    }
  }

  static async deleteProduit(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await pool.query('UPDATE produits SET actif = false WHERE id = $1', [id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting produit' });
    }
  }
}
