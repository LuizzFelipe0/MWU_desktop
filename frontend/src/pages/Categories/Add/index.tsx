import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { useApi } from '../../../hooks/useApi.tsx';
import { useAuth } from '../../../hooks/useAuth.tsx';
import { categoryService } from '../../../services/categoryService.ts';

import { Category, CategoryInput } from '../../../types/categoryTypes.ts';
import { CATEGORY_TYPES } from '../../../types/categoryTypeTypes.ts';

import CardBox from '../../../components/CardBox/index.tsx';
import Button from '../../../components/Button/DefaultButton/index.tsx';
import TextInput from '../../../components/Input/TextInput/index.tsx';
import Overlay from '../../../components/Overlay/index.tsx';
import Form from '../../../components/Form/index.tsx';
import ListInput from '../../../components/Input/SelectInput/index.tsx';

const AddCategoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refresh: refreshParentList } = useOutletContext<{
    refresh: () => void;
  }>();

  const { add, loading: isSaving } = useApi<Category, CategoryInput>(
    categoryService,
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTypeId, setCategoryTypeId] = useState('');

  const handleClose = () => navigate('..');

  const handleSave = async () => {
    if (!name.trim() || !categoryTypeId) {
      alert('Por favor, preencha o nome e selecione um tipo.');
      return;
    }

    if (!user?.id) return;

    await add({
      name,
      user_id: user.id,
      category_type_id: categoryTypeId,
      description: description,
    });

    refreshParentList();
    handleClose();
  };

  const typeOptions = CATEGORY_TYPES.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <Overlay onClose={handleClose}>
      <CardBox title="Nova Categoria">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Form.Field>
            <label>Nome</label>
            <TextInput
              placeholder="Ex: Salário, Contas mensais..."
              value={name}
              onChange={setName}
            />
          </Form.Field>

          <Form.Field>
            <label>Descrição (Opcional)</label>
            <TextInput
              placeholder="Detalhe sua categoria..."
              value={description}
              onChange={setDescription}
            />
          </Form.Field>

          <Form.Field>
            <label>Tipo de Categoria</label>
            <ListInput
              options={typeOptions}
              placeholder={
                'Selecione o tipo...'
              }
              value={categoryTypeId}
              onChange={setCategoryTypeId}
              required
            />
          </Form.Field>

          <Form.Actions $align="stretch">
            <Button variant="danger" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              icon="add"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Form.Actions>
        </Form>
      </CardBox>
    </Overlay>
  );
};

export default AddCategoryPage;
