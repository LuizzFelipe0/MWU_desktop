import { Router } from 'express';
import { financialGoalsController } from './controller';

const router = Router();

router.get('/all', financialGoalsController.getAll);
router.get('/:id', financialGoalsController.getById);
router.post('/create', financialGoalsController.create);
router.patch('/:id/update', financialGoalsController.update);
router.delete('/:id/delete', financialGoalsController.delete);

export default router;
