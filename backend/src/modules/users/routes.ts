import { Router } from 'express';
import { userController } from './controller';

const router = Router();

router.post('/create', userController.create);
router.get('/:id', userController.getById);
router.patch('/:id/update', userController.update);

export default router;
