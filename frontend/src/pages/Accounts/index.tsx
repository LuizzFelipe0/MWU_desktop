import React from 'react';
import { useApi } from '../../hooks/useApi';
import EntityList from '../../components/EntityList';
import { accountService } from '../../services/accountService';
import { Account, AccountInput } from '../../types/accountTypes';

const AccountsPage: React.FC = () => {
  const { data, refresh } = useApi<Account, AccountInput>(accountService, true);

  return (
    <EntityList
      title="Contas Bancárias"
      searchPlaceholder="Buscar conta bancária..."
      emptyMessage="Nenhuma conta bancária encontrada."
      data={data}
      refresh={refresh}
      getId={(account) => account.id}
      getName={(account) => account.name}
      getDetails={(account) => account.type}
    />
  );
};

export default AccountsPage;
