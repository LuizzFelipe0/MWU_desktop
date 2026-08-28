import { Router } from 'express';
import accountsRouter from '../modules/accounts/routes';
import transactionsRouter from '../modules/transactions/routes';
import categoriesRouter from '../modules/categories/routes';
import financialGoalsRouter from '../modules/financial_goals/routes';
import usersRouter from '../modules/users/routes';
import authRouter from '../modules/auth/routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/accounts', accountsRouter);
router.use('/transactions', transactionsRouter);
router.use('/categories', categoriesRouter);
router.use('/financial_goals', financialGoalsRouter);

export default router;
