import pool from '../config/database';

export class NumerationService {
  static async getNextDevisReference(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await pool.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 9) AS INTEGER)), 0) + 1 as next_num FROM devis WHERE reference LIKE $1',
      [`DEV-${year}-%`]
    );
    const nextNum = result.rows[0].next_num;
    return `DEV-${year}-${String(nextNum).padStart(6, '0')}`;
  }

  static async getNextBCReference(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await pool.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 7) AS INTEGER)), 0) + 1 as next_num FROM bons_commande WHERE reference LIKE $1',
      [`BC-${year}-%`]
    );
    const nextNum = result.rows[0].next_num;
    return `BC-${year}-${String(nextNum).padStart(6, '0')}`;
  }

  static async getNextFactureReference(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await pool.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 9) AS INTEGER)), 0) + 1 as next_num FROM factures WHERE reference LIKE $1',
      [`FAC-${year}-%`]
    );
    const nextNum = result.rows[0].next_num;
    return `FAC-${year}-${String(nextNum).padStart(6, '0')}`;
  }
}
