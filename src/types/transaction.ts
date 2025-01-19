export enum TransactionType {
  OUT = 0,
  IN = 1,
}

export enum TransactionStatus {
  SUCCESS = 0,
  CANCEL = 1,
  REFUND = 2,
}

export interface Transaction {
  type: TransactionType;
  amount: number;
  time: string;
  counterparty: string;
  account: string;
  category: string;
  description: string;
  status: TransactionStatus;
}

export interface CategoryGuess {
  category: [string, string, number]; // [type, text, id]
  confident?: boolean;
}

export interface AccountGuess {
  account: {
    id: string;
    name: string;
  };
}

export interface ProjectGuess {
  project: {
    id: string;
    name: string;
  };
  category: [string, string, number];
}

export interface GuessData {
  counterparty: Record<string, CategoryGuess>;
  account: Record<string, AccountGuess>;
  description: Record<string, ProjectGuess>;
} 