import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.tsx';
import { userService } from '../../services/userService.tsx';
import { User, UserInput } from '../../types/userTypes.ts';

import * as S from './styles.ts';
import CardBox from '../../components/CardBox/index.tsx';
import Button from '../../components/Button/DefaultButton/index.tsx';
import SearchBar from '../../components/SearchBar/index.tsx';
import List from '../../components/List/index.tsx';
import { useFilter } from '../../hooks/useFilter.tsx';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, refresh } = useApi<User, UserInput>(userService, true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useFilter(data, searchTerm, 'first_name');

  return (
    <S.Container>
      <CardBox title="Usuários">
        <S.HeaderActions>
          <SearchBar
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </S.HeaderActions>

        <List>
          {filteredData.map((users) => (
            <List.Item key={users.id}>
              <List.Info>
                <S.ItemTitle>{users.first_name + ' ' + users.last_name}</S.ItemTitle>
                <small>{users.email}</small>
              </List.Info>
              <List.Actions>
                <Button
                  icon="update"
                  variant="warning"
                  onClick={() => navigate(users.id)}
                ></Button>
              </List.Actions>
            </List.Item>
          ))}
        </List>

        {filteredData.length === 0 && (
          <S.EmptyState>Nenhuma Usuário encontrada.</S.EmptyState>
        )}
      </CardBox>

      <Outlet context={{ refresh }} />
    </S.Container>
  );
};

export default UsersPage;
