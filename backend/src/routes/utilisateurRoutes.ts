import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UtilisateurController } from '../controllers/utilisateurController';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), UtilisateurController.listUtilisateurs);
router.post('/', authenticate, authorize(['ADMIN']), UtilisateurController.createUtilisateur);
router.get('/:id', authenticate, UtilisateurController.getUtilisateur);
router.put('/:id', authenticate, authorize(['ADMIN']), UtilisateurController.updateUtilisateur);

export default router;
