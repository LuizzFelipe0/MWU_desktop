export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  cpf: string;
  manual_balance: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserInput extends Pick <
  User,
  'email' | 'first_name' | 'last_name'
> {
  cpf: string;
  password: string;
  manual_balance?: number;
}

export type UserSession = Pick<
  User,
  'id' | 'email' | 'first_name' | 'last_name' | 'cpf' | 'manual_balance'
>;


export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: UserSession;
}
