import { GuessData, Transaction } from '../../types/transaction';
import { Platform, PlatformIdentifier } from '../../types/platform';
import { PLATFORM_IDENTIFIERS } from './constants';
import { extractTransactionList, loadGuessData, parseCsv, saveGuessData } from '../../utils';
import { AlipayRecord, AlipayTransformer, WepayRecord, WepayTransformer } from './types';
import { createTransactionProcessor } from './transaction-processor';

interface FileUploadResult {
  transactions: Transaction[];
}

export const createSuiPlatform = () => {
  const processor = createTransactionProcessor();
  const alipayTransformer = new AlipayTransformer();
  const wepayTransformer = new WepayTransformer();

  const readFile = (file: File, encoding: 'utf-8' | 'GBK'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file, encoding);
    });
  };

  return {
    initialize: async (): Promise<GuessData> => {
      return await loadGuessData();
    },

    handleFileUpload: async (file: File): Promise<FileUploadResult> => {
      // 先尝试以 UTF-8 读取
      let text = await readFile(file, 'utf-8');
      let transactions: Transaction[] = [];

      if (text.includes(PLATFORM_IDENTIFIERS[Platform.ALIPAY].identifier)) {
        // 如果是支付宝文件，需要用 GBK 重新读取
        text = await readFile(file, 'GBK');
        const csvData = extractTransactionList(text, PLATFORM_IDENTIFIERS[Platform.ALIPAY].identifier);
        const records = parseCsv<AlipayRecord>(csvData);
        transactions = records.map(record => alipayTransformer.transform(record));
      } else if (text.includes(PLATFORM_IDENTIFIERS[Platform.WEPAY].identifier)) {
        const csvData = extractTransactionList(text, PLATFORM_IDENTIFIERS[Platform.WEPAY].identifier);
        const records = parseCsv<WepayRecord>(csvData);
        transactions = records.map(record => wepayTransformer.transform(record));
      } else {
        throw new Error('Unsupported file format');
      }

      return { transactions };
    },

    fillForm: (transaction: Transaction, guessData: GuessData): void => {
      processor.fillForm(transaction, guessData);
    },

    canAutoSave: (transaction: Transaction, guessData: GuessData): boolean => {
      return processor.canAutoSave(transaction, guessData);
    },

    save: async (state: { currentTransaction: Transaction | null }, autoSave: boolean): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (!state.currentTransaction) return;

      if (!autoSave) {
        const newGuessData = processor.learn(state.currentTransaction, false);
        await saveGuessData(newGuessData);
      }

      await processor.save();
    },

    saveWithConfidence: async (state: { currentTransaction: Transaction | null }): Promise<void> => {
      if (!state.currentTransaction) return;

      const newGuessData = processor.learn(state.currentTransaction, true);
      await saveGuessData(newGuessData);
      await processor.save();
    },
  };
}; 