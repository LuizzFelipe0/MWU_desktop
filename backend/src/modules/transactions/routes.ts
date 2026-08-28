import { Router } from 'express';
import { transactionsController } from './controller';

const router = Router();

router.get('/all', transactionsController.getAll);
router.get('/:id', transactionsController.getById);
router.post('/create', transactionsController.create);
router.patch('/:id/update', transactionsController.update);
router.delete('/:id/delete', transactionsController.delete);

export default router;
