import { Transaction } from './transaction';

export enum Platform {
  ALIPAY = 0,
  WEPAY = 1,
}

export interface PlatformIdentifier {
  name: string;
  identifier: string;
  encoding: 'utf-8' | 'GBK';
}

export interface TransactionTransformer<T> {
  transform(record: T): Transaction;
} 