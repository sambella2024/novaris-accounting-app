import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List produits' });
});

router.post('/', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'Create produit' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get produit' });
});

router.put('/:id', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'Update produit' });
});

export default router;
