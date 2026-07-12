export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id?: number;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  note?: string;
}
