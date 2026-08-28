import { Router } from 'express';
import { accountsController } from './controller';

const router = Router();

router.get('/all', accountsController.getAll);
router.get('/:id', accountsController.getById);
router.post('/create', accountsController.create);
router.patch('/:id/update', accountsController.update);
router.delete('/:id/delete', accountsController.delete);

export default router;
