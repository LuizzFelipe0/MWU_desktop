import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';

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
import SelectInput from '../../../components/Input/SelectInput/index.tsx';
import ConfirmModal from '../../../components/Modal/ConfirmModal/index.tsx';

const UpdateCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refresh: refreshParentList } = useOutletContext<{
    refresh: () => void;
  }>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    getOne,
    edit,
    remove,
    item,
    loading: isBusy,
  } = useApi<Category, CategoryInput>(categoryService);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTypeId, setCategoryTypeId] = useState('');

  useEffect(() => {
    if (id) {
      getOne(id);
    }
  }, [id, getOne]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setCategoryTypeId(item.category_type_id);
    }
  }, [item]);

  const handleClose = () => navigate('..');

  const handleUpdate = async () => {
    if (!name.trim() || !id || !user?.id || !categoryTypeId) return;

    await edit(id, {
      user_id: user.id,
      name,
      category_type_id: categoryTypeId,
      description: description,
    });

    refreshParentList();
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    await remove(id);
    setIsDeleteModalOpen(false);
    refreshParentList();
    handleClose();
  };

  const typeOptions = CATEGORY_TYPES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <>
      <Overlay onClose={handleClose}>
        <CardBox title={item ? `${item.name}` : 'Carregando...'}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <Form.Field>
              <label>Nome</label>
              <TextInput
                placeholder="Ex: Alimentação..."
                value={name}
                onChange={setName}
              />
            </Form.Field>

            <Form.Field>
              <label>Descrição (Opcional)</label>
              <TextInput
                placeholder="Detalhes..."
                value={description}
                onChange={setDescription}
              />
            </Form.Field>

            <Form.Field>
              <label>Tipo de Categoria</label>
              <SelectInput
                options={typeOptions}
                placeholder="Selecione o tipo da categoria..."
                value={categoryTypeId}
                onChange={setCategoryTypeId}
                required
              />
            </Form.Field>

            <Form.Actions $align="stretch">
              <Button
                variant="danger"
                type="button"
                icon="delete"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Apagar
              </Button>

              <Button
                type="submit"
                disabled={isBusy}
                icon="update"
                variant="warning"
              >
                {isBusy ? 'Salvando...' : 'Atualizar'}
              </Button>
            </Form.Actions>
          </Form>
        </CardBox>
      </Overlay>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja apagar a categoria "${name}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Apagar"
        confirmVariant="danger"
        confirmIcon="delete"
        isLoading={isBusy}
      />
    </>
  );
};

export default UpdateCategoryPage;
