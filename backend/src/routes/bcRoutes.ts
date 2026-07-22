import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { BCController } from '../controllers/bcController';

const router = Router();

router.get('/', authenticate, BCController.listBC);
router.get('/:id', authenticate, BCController.getBC);
router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), BCController.validateBC);
router.post('/:id/transform-to-facture', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), BCController.transformToFacture);
router.get('/:id/pdf', authenticate, BCController.exportPDF);

export default router;
