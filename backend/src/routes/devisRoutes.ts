import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Placeholder routes - will be implemented
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List devis' });
});

router.post('/', authenticate, authorize(['COMMERCIAL', 'ADMIN']), (req, res) => {
  res.json({ message: 'Create devis' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get devis' });
});

router.put('/:id', authenticate, authorize(['COMMERCIAL', 'ADMIN']), (req, res) => {
  res.json({ message: 'Update devis' });
});

router.post('/:id/transform-to-bc', authenticate, authorize(['RESPONSABLE_FINANCIER']), (req, res) => {
  res.json({ message: 'Transform to BC' });
});

router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER']), (req, res) => {
  res.json({ message: 'Validate devis' });
});

router.get('/:id/historique', authenticate, (req, res) => {
  res.json({ message: 'Get historique' });
});

export default router;
