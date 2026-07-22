import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List BC' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get BC' });
});

router.post('/:id/transform-to-facture', authenticate, authorize(['RESPONSABLE_FINANCIER']), (req, res) => {
  res.json({ message: 'Transform to Facture' });
});

router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER']), (req, res) => {
  res.json({ message: 'Validate BC' });
});

router.get('/:id/historique', authenticate, (req, res) => {
  res.json({ message: 'Get BC historique' });
});

export default router;
