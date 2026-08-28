import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.tsx';
import { financialGoalService } from '../../services/financialGoalService.ts';
import { FinancialGoal, FinancialGoalInput } from '../../types/financialGoalTypes.ts';

import * as S from './styles.ts';
import CardBox from '../../components/CardBox/index.tsx';
import Button from '../../components/Button/DefaultButton/index.tsx';
import SearchBar from '../../components/SearchBar/index.tsx';
import List from '../../components/List/index.tsx';
import { useFilter } from '../../hooks/useFilter.tsx';

const FinancialGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, refresh } = useApi<FinancialGoal, FinancialGoalInput>(
    financialGoalService,
    true
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useFilter(data, searchTerm, 'name');

  return (
    <S.Container>
      <CardBox title="Metas Financeiras">
        <S.HeaderActions>
          <SearchBar
            placeholder="Buscar meta financeira..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Button icon="add" onClick={() => navigate('add')}></Button>
        </S.HeaderActions>

        <List>
          {filteredData.map((fingoals) => (
            <List.Item key={fingoals.id}>
              <List.Info>
                <S.ItemTitle>{fingoals.name}</S.ItemTitle>
                <small
                >
                  {fingoals.description}
                </small>
              </List.Info>
              <List.Actions>
                <Button
                  icon="update"
                  variant="warning"
                  onClick={() => navigate(fingoals.id)}
                ></Button>
              </List.Actions>
            </List.Item>
          ))}
        </List>

        {filteredData.length === 0 && (
          <S.EmptyState>Nenhuma Meta Financeira encontrada.</S.EmptyState>
        )}
      </CardBox>

      <Outlet context={{ refresh }} />
    </S.Container>
  );
};

export default FinancialGoalsPage;
