export interface CategoryType {
  id: string;
  name: string;
  is_positive: boolean;
}

export interface CategoryTypeInput {
  name?: string;
  is_positive?: boolean;
}

export const CATEGORY_TYPES: CategoryType[] = [
  { id: '068165d71db874f4800051632b7e378e', name: 'Investimentos', is_positive: false },
  { id: '068165d8ef167fab800070d5357eb02f', name: 'Transferencia', is_positive: false },
  { id: '068165de6ada762d8000a61e3c6959bd', name: 'Receita', is_positive: true },
  { id: '068165e04bde775380002faf9c6931ac', name: 'Despesa', is_positive: false },
];

