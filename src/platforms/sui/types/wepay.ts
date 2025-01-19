import { Transaction, TransactionStatus, TransactionType } from '../../../types/transaction';
import { TransactionTransformer } from '../../../types/platform';

export interface WepayRecord {
  '交易时间': string;
  '交易类型': string;
  '交易对方': string;
  '商品': string;
  '收/支': string;
  '金额(元)': string;
  '支付方式': string;
  '当前状态': string;
}

export class WepayTransformer implements TransactionTransformer<WepayRecord> {
  transform(record: WepayRecord): Transaction {
    return {
      type: this.getTransactionType(record['收/支']),
      amount: this.parseAmount(record['金额(元)']),
      time: record['交易时间'],
      counterparty: record['交易对方'],
      account: record['支付方式'],
      category: record['交易类型'],
      description: record['商品'],
      status: this.getTransactionStatus(record['当前状态'], record['收/支']),
    };
  }

  private parseAmount(amount: string): number {
    return Number(amount.slice(1));
  }

  private getTransactionType(type: string): TransactionType {
    switch (type) {
      case '支出':
        return TransactionType.OUT;
      case '收入':
        return TransactionType.IN;
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private getTransactionStatus(status: string, type: string): TransactionStatus {
    if (status === '已全额退款' && type === '收入') {
      return TransactionStatus.REFUND;
    }
    return TransactionStatus.SUCCESS;
  }
} 