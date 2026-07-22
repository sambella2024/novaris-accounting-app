import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List clients' });
});

router.post('/', authenticate, authorize(['COMMERCIAL', 'ADMIN']), (req, res) => {
  res.json({ message: 'Create client' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get client' });
});

router.put('/:id', authenticate, authorize(['COMMERCIAL', 'ADMIN']), (req, res) => {
  res.json({ message: 'Update client' });
});

export default router;
