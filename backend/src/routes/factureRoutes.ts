import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List Factures' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get Facture' });
});

router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER']), (req, res) => {
  res.json({ message: 'Validate Facture' });
});

router.get('/:id/historique', authenticate, (req, res) => {
  res.json({ message: 'Get Facture historique' });
});

export default router;
