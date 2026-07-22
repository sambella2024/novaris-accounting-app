import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { ClientController } from '../controllers/clientController';

const router = Router();

router.get('/', authenticate, ClientController.listClients);
router.post('/', authenticate, authorize(['COMMERCIAL', 'ADMIN']), ClientController.createClient);
router.get('/:id', authenticate, ClientController.getClient);
router.put('/:id', authenticate, authorize(['COMMERCIAL', 'ADMIN']), ClientController.updateClient);

export default router;
