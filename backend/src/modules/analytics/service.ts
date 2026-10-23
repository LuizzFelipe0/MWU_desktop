import { AppDataSource } from '../../db';
import { Account } from '../accounts/entity';
import { Category } from '../categories/entity';
import { CategoryType } from '../category_types/entity';
import { FinancialGoal } from '../financial_goals/entity';
import { Transaction } from '../transactions/entity';

export const analyticsService = {
  expensesByMonth: async (userId: string) => {
    const year = new Date().getFullYear();
    const [transactions, categories, categoryTypes] = await Promise.all([
      AppDataSource.getRepository(Transaction).findBy({ user_id: userId }),
      AppDataSource.getRepository(Category).findBy({ user_id: userId }),
      AppDataSource.getRepository(CategoryType).find(),
    ]);

    const categoriesById = new Map(categories.map((category) => [category.id, category]));
    const categoryTypesById = new Map(categoryTypes.map((categoryType) => [categoryType.id, categoryType]));
    const totalsByMonthAndType = new Map<string, {
      year: number;
      month: number;
      categoryType: CategoryType;
      total: number;
    }>();

    for (const transaction of transactions) {
      if (transaction.deleted_at) continue;
      const date = new Date(transaction.date);
      if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) continue;

      const category = categoriesById.get(transaction.category_id);
      const categoryType = category && categoryTypesById.get(category.category_type_id);
      if (!categoryType) continue;

      const month = date.getMonth() + 1;
      const key = `${year}-${month}-${categoryType.id}`;
      const current = totalsByMonthAndType.get(key);
      if (current) current.total += Number(transaction.amount) || 0;
      else totalsByMonthAndType.set(key, { year, month, categoryType, total: Number(transaction.amount) || 0 });
    }

    const monthlyTotals = new Map<number, number>();
    for (const row of totalsByMonthAndType.values()) {
      monthlyTotals.set(row.month, (monthlyTotals.get(row.month) ?? 0) + row.total);
    }

    return [...totalsByMonthAndType.values()]
      .map(({ year: rowYear, month, categoryType, total }) => ({
        year: rowYear,
        month,
        category_name: categoryType.name,
        category_type_name: categoryType.name,
        is_positive: categoryType.is_positive,
        total_amount: total,
        percentage: monthlyTotals.get(month) ? (total / monthlyTotals.get(month)!) * 100 : 0,
      }))
      .sort((left, right) => left.month - right.month || left.category_type_name.localeCompare(right.category_type_name));
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
