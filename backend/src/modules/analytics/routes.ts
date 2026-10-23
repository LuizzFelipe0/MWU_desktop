import { Router, Request, Response } from 'express';
import { analyticsService } from './service';

const router = Router();
const requireUserId = (req: Request) => {
  const userId = req.header('x-user-id');
  if (!userId) throw new Error('x-user-id is required');
  return userId;
};

router.get('/expenses/monthly/category-type', async (req: Request, res: Response) => {
  try {
    return res.json(await analyticsService.expensesByMonth(requireUserId(req)));
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/goals-analysis/all', async (req: Request, res: Response) => {
  try {
    return res.json(await analyticsService.goalProgress(requireUserId(req)));
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
