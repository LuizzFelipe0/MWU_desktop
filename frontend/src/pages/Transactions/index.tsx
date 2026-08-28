import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.tsx';
import { transactionService } from '../../services/transactionService.ts';
import { Transaction, TransactionInput } from '../../types/transactionTypes.ts';

import * as S from './styles.ts';
import CardBox from '../../components/CardBox/index.tsx';
import Button from '../../components/Button/DefaultButton/index.tsx';
import SearchBar from '../../components/SearchBar/index.tsx';
import List from '../../components/List/index.tsx';
import FilterPanel from '../../components/FilterPanel/index.tsx';
import SelectInput from '../../components/Input/SelectInput/index.tsx';
import { useFilter } from '../../hooks/useFilter.tsx';
import { month_options } from '../../utils/mappings.ts';
import { getYearOptionsFromData } from '../../utils/time.ts';
import { accountService } from '../../services/accountService.ts';
import { Account, AccountInput } from '../../types/accountTypes.ts';

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data, refresh, loading } = useApi<Transaction, TransactionInput>(
    transactionService,
    true,
  );

  const { data: accountsData } = useApi<Account, AccountInput>(
    accountService,
    true,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),);
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, '0'),);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const yearOptions = useMemo(
    () => getYearOptionsFromData(data, 'date'),
    [data],
  );

  const filteredData = useFilter(data, searchTerm, 'name', {
    date: { year: selectedYear, month: selectedMonth, key: 'date' },
    item: { account_id: selectedAccountId }
  });

  return (
    <S.PageLayout>
      <S.Container>
        <CardBox title="Transações">
          <S.HeaderActions>
            <SearchBar
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Button icon="add" onClick={() => navigate('add')}></Button>
          </S.HeaderActions>

          <List>
            {filteredData.map((tra) => (
              <List.Item key={tra.id}>
                <List.Info>
                  <S.ItemTitle>{tra.name}</S.ItemTitle>
                  <small>
                    {new Date(tra.date).toLocaleDateString('pt-BR')}
                  </small>
                </List.Info>
                <List.Actions>
                  <Button
                    icon="update"
                    variant="warning"
                    onClick={() => navigate(tra.id)}
                  />
                </List.Actions>
              </List.Item>
            ))}
          </List>

          {filteredData.length === 0 && !loading && (
            <S.EmptyState>Nenhuma Transação encontrada.</S.EmptyState>
          )}
        </CardBox>
      </S.Container>

      <S.Sidebar>
        <FilterPanel
          onClear={() => {
            setSelectedYear('');
            setSelectedMonth('');
            setSelectedAccountId('');
          }}
        >
          <FilterPanel.Field>
            <label>Ano</label>
            <SelectInput
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Todos os anos"
            />
          </FilterPanel.Field>

          <FilterPanel.Field>
            <label>Mês</label>
            <SelectInput
              options={month_options}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Todos os meses"
            />
          </FilterPanel.Field>

          <FilterPanel.Field>
            <label>Conta Bancária</label>
            <SelectInput
              options={accountsData.map((a) => ({
                value: a.id,
                label: a.name,
              }))}
              value={selectedAccountId}
              onChange={setSelectedAccountId}
              placeholder="Todas as Contas"
            />
          </FilterPanel.Field>
        </FilterPanel>
      </S.Sidebar>
      <Outlet context={{ refresh }} />
    </S.PageLayout>
  );
};

export default TransactionsPage;
