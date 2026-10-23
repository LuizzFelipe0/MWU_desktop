import React from 'react';
import { useApi } from '../../hooks/useApi';
import EntityList from '../../components/EntityList';
import { categoryService } from '../../services/categoryService';
import { Category, CategoryInput } from '../../types/categoryTypes';

const CategoriesPage: React.FC = () => {
  const { data, refresh } = useApi<Category, CategoryInput>(categoryService, true);

  return (
    <EntityList
      title="Categorias"
      searchPlaceholder="Buscar categoria..."
      emptyMessage="Nenhuma categoria encontrada."
      data={data}
      refresh={refresh}
      getId={(category) => category.id}
      getName={(category) => category.name}
      getDetails={(category) => category.description}
    />
  );
};

export default CategoriesPage;
