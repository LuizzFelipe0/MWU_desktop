import { Router } from 'express';
import { categoriesController } from './controller';

const router = Router();

router.get('/all', categoriesController.getAll);
router.get('/:id', categoriesController.getById);
router.post('/create', categoriesController.create);
router.patch('/:id/update', categoriesController.update);
router.delete('/:id/delete', categoriesController.delete);

export default router;
