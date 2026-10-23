import React from 'react';
import { useApi } from '../../hooks/useApi';
import EntityList from '../../components/EntityList';
import { financialGoalService } from '../../services/financialGoalService';
import { FinancialGoal, FinancialGoalInput } from '../../types/financialGoalTypes';

const FinancialGoalsPage: React.FC = () => {
  const { data, refresh } = useApi<FinancialGoal, FinancialGoalInput>(
    financialGoalService,
    true,
  );

  return (
    <EntityList
      title="Metas Financeiras"
      searchPlaceholder="Buscar meta financeira..."
      emptyMessage="Nenhuma meta financeira encontrada."
      data={data}
      refresh={refresh}
      getId={(goal) => goal.id}
      getName={(goal) => goal.name}
      getDetails={(goal) => goal.description}
    />
  );
};

export default FinancialGoalsPage;
