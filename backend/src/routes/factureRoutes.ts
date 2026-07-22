import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { FactureController } from '../controllers/factureController';

const router = Router();

router.get('/', authenticate, FactureController.listFactures);
router.get('/:id', authenticate, FactureController.getFacture);
router.post('/:id/validate', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), FactureController.validateFacture);
router.put('/:id/status', authenticate, authorize(['RESPONSABLE_FINANCIER', 'ADMIN']), FactureController.updateStatus);
router.get('/:id/pdf', authenticate, FactureController.exportPDF);

export default router;
