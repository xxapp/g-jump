import { Transaction, TransactionStatus, TransactionType } from '../../../types/transaction';
import { TransactionTransformer } from '../../../types/platform';
import { formatTime, parseTime } from '../../../utils';

export interface AlipayRecord {
  '交易时间': string;
  '交易分类': string;
  '交易对方': string;
  '商品说明': string;
  '收/支': string;
  '金额': number;
  '收/付款方式': string;
  '交易状态': string;
}

export class AlipayTransformer implements TransactionTransformer<AlipayRecord> {
  transform(record: AlipayRecord): Transaction {
    return {
      type: this.getTransactionType(record['收/支']),
      amount: record['金额'],
      time: formatTime(parseTime(record['交易时间'])),
      counterparty: record['交易对方'],
      account: record['收/付款方式'],
      category: record['交易分类'],
      description: record['商品说明'],
      status: this.getTransactionStatus(record['交易状态']),
    };
  }

  private getTransactionType(type: string): TransactionType {
    switch (type) {
      case '支出':
        return TransactionType.OUT;
      case '不计收支':
        return TransactionType.IN;
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private getTransactionStatus(status: string): TransactionStatus {
    switch (status) {
      case '交易关闭':
        return TransactionStatus.CANCEL;
      case '退款成功':
        return TransactionStatus.REFUND;
      default:
        return TransactionStatus.SUCCESS;
    }
  }
} 