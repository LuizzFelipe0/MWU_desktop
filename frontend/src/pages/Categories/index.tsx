import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.tsx';
import { categoryService } from '../../services/categoryService.ts';
import { Category, CategoryInput } from '../../types/categoryTypes.ts';

import * as S from './styles.ts';
import CardBox from '../../components/CardBox/index.tsx';
import Button from '../../components/Button/DefaultButton/index.tsx';
import SearchBar from '../../components/SearchBar/index.tsx';
import List from '../../components/List/index.tsx';
import { useFilter } from '../../hooks/useFilter.tsx';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, refresh } = useApi<Category, CategoryInput>(
    categoryService,
    true
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useFilter(data, searchTerm, 'name');

  return (
    <S.Container>
      <CardBox title="Categorias">
        <S.HeaderActions>
          <SearchBar
            placeholder="Buscar categoria..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Button icon="add" onClick={() => navigate('add')}></Button>
        </S.HeaderActions>

        <List>
          {filteredData.map((cat) => (
            <List.Item key={cat.id}>
              <List.Info>
                <S.ItemTitle>{cat.name}</S.ItemTitle>
                <small>
                  {cat.description}
                </small
                 >
              </List.Info>

              <List.Actions>
                <Button
                  icon="update"
                  variant="warning"
                  onClick={() => navigate(cat.id)}
                ></Button>
              </List.Actions>
            </List.Item>
          ))}
        </List>

        {filteredData.length === 0 && (
          <S.EmptyState>Nenhuma Categoria encontrada.</S.EmptyState>
        )}
      </CardBox>

      <Outlet context={{ refresh }} />
    </S.Container>
  );
};

export default CategoriesPage;
