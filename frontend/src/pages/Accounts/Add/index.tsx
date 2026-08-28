import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi.tsx';
import { useAuth } from '../../../hooks/useAuth.tsx';
import { accountService } from '../../../services/accountService.ts';
import {
  Account,
  AccountInput,
} from '../../../types/accountTypes.ts';

import CardBox from '../../../components/CardBox/index.tsx';
import Button from '../../../components/Button/DefaultButton/index.tsx';
import TextInput from '../../../components/Input/TextInput/index.tsx';
import Overlay from '../../../components/Overlay/index.tsx';
import Form from '../../../components/Form/index.tsx';
import NumberInput from '../../../components/Input/NumberInput/index.tsx';
import { parseCurrencyToNumber } from '../../../utils/currency.ts';
import SelectInput from '../../../components/Input/SelectInput/index.tsx';
import { account_type_options } from '../../../utils/mappings.ts';

const AddAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refresh } = useOutletContext<{ refresh: () => void }>();
  const { add, loading } = useApi<Account, AccountInput>(accountService);

  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balanceFormatted, setBalanceFormatted] = useState('0,00');
  const [type, setType] = useState('');

  const handleClose = () => navigate('..');

  const handleSave = async () => {
    if (!name.trim() || balanceFormatted === '0,00' || !type) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!user?.id) {
      alert('Erro: Usuário não identificado.');
      return;
    }

    const numericAmount = parseCurrencyToNumber(balanceFormatted);

    await add({
      user_id: user.id,
      name: name,
      account_number: accountNumber,
      balance: numericAmount,
      type: type,
    });

    refresh();
    handleClose();
  };

  return (
    <Overlay onClose={handleClose}>
      <CardBox title="Nova Conta Bancária">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Form.Field>
            <label>Nome da Conta Bancária</label>
            <TextInput
              placeholder="Ex: Minha Conta Bancária..."
              value={name}
              onChange={setName}
            />
          </Form.Field>

          <Form.Field>
            <label>Tipo da Conta</label>
            <SelectInput
              placeholder="Selecione o tipo..."
              value={type}
              onChange={setType}
              options={account_type_options}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Número da Conta (Opcional)</label>
            <TextInput
              placeholder="Insira o número da Conta..."
              value={accountNumber}
              onChange={setAccountNumber}
            />
          </Form.Field>

          <Form.Field>
            <label>Saldo da Conta ($)</label>
            <NumberInput
              placeholder="0,00"
              value={balanceFormatted}
              onChange={setBalanceFormatted}
            />
          </Form.Field>

          <Form.Actions $align="stretch">
            <Button variant="danger" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} icon="add">
              {loading ? 'Salvando...' : 'Criar Conta'}
            </Button>
          </Form.Actions>
        </Form>
      </CardBox>
    </Overlay>
  );
};

export default AddAccountPage;
