import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'List utilisateurs' });
});

router.post('/', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'Create utilisateur' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get utilisateur' });
});

router.put('/:id', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: 'Update utilisateur' });
});

export default router;
