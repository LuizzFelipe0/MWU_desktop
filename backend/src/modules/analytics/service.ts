import { AppDataSource } from '../../db';
import { Account } from '../accounts/entity';
import { FinancialGoal } from '../financial_goals/entity';
import { Transaction } from '../transactions/entity';

export const analyticsService = {
  expensesByMonth: async (userId: string) => {
    const year = new Date().getFullYear();
    const rows = await AppDataSource.getRepository(Transaction)
      .createQueryBuilder('transaction')
      .innerJoin('categories', 'category', 'category.id = transaction.category_id')
      .innerJoin('category_types', 'categoryType', 'categoryType.id = category.category_type_id')
      .select('CAST(strftime("%Y", transaction.date) AS INTEGER)', 'year')
      .addSelect('CAST(strftime("%m", transaction.date) AS INTEGER)', 'month')
      .addSelect('categoryType.name', 'category_name')
      .addSelect('categoryType.name', 'category_type_name')
      .addSelect('categoryType.is_positive', 'is_positive')
      .addSelect('SUM(transaction.amount)', 'total_amount')
      .addSelect('0', 'percentage')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('CAST(strftime("%Y", transaction.date) AS INTEGER) = :year', { year })
      .andWhere('transaction.deleted_at IS NULL')
      .groupBy('year, month, categoryType.name, categoryType.is_positive')
      .orderBy('month', 'ASC')
      .getRawMany();
    return rows.map((row) => ({
      ...row,
      year: Number(row.year),
      month: Number(row.month),
      total_amount: Number(row.total_amount),
      is_positive: row.is_positive === true || row.is_positive === 1 || row.is_positive === '1',
      percentage: Number(row.percentage),
    }));
  },

  goalProgress: async (userId: string) => {
    const goals = await AppDataSource.getRepository(FinancialGoal).findBy({ user_id: userId });
    const accounts = await AppDataSource.getRepository(Account).findBy({ user_id: userId });
    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
    const now = new Date();

    return goals.map((goal) => {
      const target = Number(goal.target_amount || 0);
      const saved = totalBalance;
      const remaining = Math.max(target - saved, 0);
      const deadline = new Date(goal.deadline);
      const monthsRemaining = Math.max(
        1,
        (deadline.getFullYear() - now.getFullYear()) * 12 + deadline.getMonth() - now.getMonth(),
      );
      const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

      return {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        target_amount: target,
        progress_percentage: `${progress.toFixed(1)}%`,
        sum_of_balances: saved,
        difference_to_achieve_target: remaining,
        deadline: goal.deadline,
        monthly_saving_required: remaining / monthsRemaining,
      };
    });
  },
};
