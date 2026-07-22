import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class ClientController {
  static async createClient(req: Request, res: Response) {
    try {
      const { nom, adresse, telephone, email, nif, contact_person } = req.body;
      const clientId = uuidv4();

      await pool.query(
        `INSERT INTO clients (id, nom, adresse, telephone, email, nif, contact_person, date_creation, date_modification)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [clientId, nom, adresse, telephone, email, nif, contact_person]
      );

      const client = await pool.query('SELECT * FROM clients WHERE id = $1', [clientId]);
      res.status(201).json({ success: true, client: client.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error creating client' });
    }
  }

  static async listClients(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 50 } = req.query;
      let query = 'SELECT * FROM clients WHERE 1=1';
      const params: any[] = [];

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (nom ILIKE $${params.length} OR email ILIKE $${params.length} OR telephone ILIKE $${params.length})`;
      }

      query += ` ORDER BY nom ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit);
      params.push((Number(page) - 1) * Number(limit));

      const result = await pool.query(query, params);
      res.json({ clients: result.rows, total: result.rowCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching clients' });
    }
  }

  static async getClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching client' });
    }
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nom, adresse, telephone, email, nif, contact_person } = req.body;

      await pool.query(
        `UPDATE clients SET nom = $1, adresse = $2, telephone = $3, email = $4, nif = $5, contact_person = $6, date_modification = NOW()
         WHERE id = $7`,
        [nom, adresse, telephone, email, nif, contact_person, id]
      );

      const client = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      res.json({ success: true, client: client.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Error updating client' });
    }
  }
}
