import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

export class UtilisateurController {
  static async createUtilisateur(req: Request, res: Response) {
    try {
      const { nom, prenom, email, mot_de_passe, role } = req.body;
      const utilisateurId = uuidv4();

      const hashedPassword = await bcryptjs.hash(mot_de_passe, 10);

      await pool.query(
        `INSERT INTO utilisateurs (id, nom, prenom, email, mot_de_passe, role, actif, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
        [utilisateurId, nom, prenom, email, hashedPassword, role]
      );

      const utilisateur = await pool.query('SELECT id, nom, prenom, email, role, actif FROM utilisateurs WHERE id = $1', [utilisateurId]);
      res.status(201).json({ success: true, utilisateur: utilisateur.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error creating utilisateur' });
    }
  }

  static async listUtilisateurs(req: Request, res: Response) {
    try {
      const { role, actif, page = 1, limit = 50 } = req.query;
      let query = 'SELECT id, nom, prenom, email, role, actif, date_creation FROM utilisateurs WHERE 1=1';
      const params: any[] = [];

      if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
      }

      if (actif !== undefined) {
        params.push(actif === 'true');
        query += ` AND actif = $${params.length}`;
      }

      query += ` ORDER BY nom ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ utilisateurs: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching utilisateurs' });
    }
  }

  static async getUtilisateur(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT id, nom, prenom, email, role, actif FROM utilisateurs WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching utilisateur' });
    }
  }

  static async updateUtilisateur(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nom, prenom, role, actif } = req.body;

      await pool.query(
        `UPDATE utilisateurs SET nom = $1, prenom = $2, role = $3, actif = $4, date_modification = NOW()
         WHERE id = $5`,
        [nom, prenom, role, actif, id]
      );

      const utilisateur = await pool.query('SELECT id, nom, prenom, email, role, actif FROM utilisateurs WHERE id = $1', [id]);
      res.json({ success: true, utilisateur: utilisateur.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error updating utilisateur' });
    }
  }
}
