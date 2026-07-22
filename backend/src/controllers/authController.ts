import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { nom, prenom, email, mot_de_passe, role } = req.body;

      const hashedPassword = await bcryptjs.hash(mot_de_passe, 10);
      const userId = uuidv4();

      await pool.query(
        'INSERT INTO utilisateurs (id, nom, prenom, email, mot_de_passe, role, actif, date_creation) VALUES ($1, $2, $3, $4, $5, $6, true, NOW())',
        [userId, nom, prenom, email, hashedPassword, role]
      );

      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, mot_de_passe } = req.body;

      const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcryptjs.compare(mot_de_passe, user.mot_de_passe);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}
