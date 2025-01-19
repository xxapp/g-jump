import { GuessData, Transaction } from '../types/transaction';

export interface ITransactionProcessor {
  // 处理单个交易记录
  process(transaction: Transaction): Promise<void>;
  
  // 判断是否可以自动保存
  canAutoSave(transaction: Transaction, guessData: GuessData): boolean;
  
  // 填充表单数据
  fillForm(transaction: Transaction, guessData: GuessData): void;
  
  // 学习新的分类规则
  learn(transaction: Transaction, confident: boolean): void;
  
  // 保存记录
  save(): Promise<void>;
} 