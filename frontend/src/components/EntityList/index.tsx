import React, { ReactNode, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CardBox from '../CardBox';
import Button from '../Button/DefaultButton';
import SearchBar from '../SearchBar';
import List from '../List';
import { useFilter } from '../../hooks/useFilter';
import * as S from './styles';

interface EntityListProps<T> {
  title: string;
  searchPlaceholder: string;
  emptyMessage: string;
  data: T[];
  refresh: () => Promise<void> | void;
  getId: (item: T) => string;
  getName: (item: T) => string;
  getDetails?: (item: T) => ReactNode;
}

function EntityList<T>({
  title,
  searchPlaceholder,
  emptyMessage,
  data,
  refresh,
  getId,
  getName,
  getDetails,
}: EntityListProps<T>) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useFilter(data, searchTerm, getName);

  return (
    <S.Container>
      <CardBox title={title}>
        <S.HeaderActions>
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Button icon="add" onClick={() => navigate('add')} />
        </S.HeaderActions>

        <List>
          {filteredData.map((item) => (
            <List.Item key={getId(item)}>
              <List.Info>
                <S.ItemTitle>{getName(item)}</S.ItemTitle>
                {getDetails && <small>{getDetails(item)}</small>}
              </List.Info>
              <List.Actions>
                <Button
                  icon="update"
                  variant="warning"
                  onClick={() => navigate(getId(item))}
                />
              </List.Actions>
            </List.Item>
          ))}
        </List>

        {filteredData.length === 0 && <S.EmptyState>{emptyMessage}</S.EmptyState>}
      </CardBox>
      <Outlet context={{ refresh }} />
    </S.Container>
  );
}

export default EntityList;
