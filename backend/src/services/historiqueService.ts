import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class HistoriqueService {
  static async addHistorique(
    documentType: 'DEVIS' | 'BC' | 'FACTURE',
    documentId: string,
    action: string,
    userId: string,
    details?: string
  ): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO historique (id, document_type, document_id, action, utilisateur_id, details, date_action) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [uuidv4(), documentType, documentId, action, userId, details || null]
      );
    } catch (error) {
      console.error('Error adding historique:', error);
    }
  }

  static async getHistorique(documentType: string, documentId: string): Promise<any[]> {
    const result = await pool.query(
      'SELECT * FROM historique WHERE document_type = $1 AND document_id = $2 ORDER BY date_action DESC',
      [documentType, documentId]
    );
    return result.rows;
  }
}
