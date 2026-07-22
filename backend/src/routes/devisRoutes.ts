import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { DevisController } from '../controllers/devisController';

const router = Router();

router.get('/', authenticate, DevisController.listDevis);
router.post('/', authenticate, authorize(['COMMERCIAL', 'ADMIN']), DevisController.createDevis);
router.get('/:id', authenticate, DevisController.getDevis);
router.put('/:id', authenticate, authorize(['COMMERCIAL', 'ADMIN']), DevisController.updateDevis);
router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), DevisController.validateDevis);
router.post('/:id/transform-to-bc', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), DevisController.transformToBC);
router.get('/:id/pdf', authenticate, DevisController.exportPDF);

export default router;
