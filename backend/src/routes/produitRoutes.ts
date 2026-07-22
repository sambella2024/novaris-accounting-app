import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { ProduitController } from '../controllers/produitController';

const router = Router();

router.get('/', authenticate, ProduitController.listProduits);
router.post('/', authenticate, authorize(['ADMIN']), ProduitController.createProduit);
router.get('/:id', authenticate, ProduitController.getProduit);
router.put('/:id', authenticate, authorize(['ADMIN']), ProduitController.updateProduit);
router.delete('/:id', authenticate, authorize(['ADMIN']), ProduitController.deleteProduit);

export default router;
