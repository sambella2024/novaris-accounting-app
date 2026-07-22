import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import devisRoutes from './routes/devisRoutes';
import bcRoutes from './routes/bcRoutes';
import factureRoutes from './routes/factureRoutes';
import produitRoutes from './routes/produitRoutes';
import clientRoutes from './routes/clientRoutes';
import utilisateurRoutes from './routes/utilisateurRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/bc', bcRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);

// Error Handler
app.use(errorHandler);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
