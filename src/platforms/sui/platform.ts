import { GuessData, Transaction } from '../../types/transaction';
import { Platform, PlatformIdentifier } from '../../types/platform';
import { PLATFORM_IDENTIFIERS, ALIPAY_SKIP_PATTERNS } from './constants';
import { extractTransactionList, loadGuessData, parseCsv, saveGuessData } from '../../utils';
import { AlipayRecord, AlipayTransformer, WepayRecord, WepayTransformer } from './types';
import { createTransactionProcessor } from './transaction-processor';

interface FileUploadResult {
  transactions: Transaction[];
  rawRecords: (AlipayRecord | WepayRecord)[];
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
      let transactions: Transaction[] = [];
      let rawRecords: (AlipayRecord | WepayRecord)[] = [];

      // 根据文件名判断编码
      const isAlipayFile = file.name.toLowerCase().includes('alipay');
      const encoding = isAlipayFile ? 'GBK' : 'utf-8';
      
      // 读取文件
      const text = await readFile(file, encoding);
      
      // 检查是否是支付宝文件
      if (text.includes(PLATFORM_IDENTIFIERS[Platform.ALIPAY].identifier)) {
        const csvData = extractTransactionList(text, PLATFORM_IDENTIFIERS[Platform.ALIPAY].identifier);
        rawRecords = parseCsv<AlipayRecord>(csvData).reverse();
        
        // 转换为 transactions 并过滤掉包含跳过模式的记录
        const allTransactions = rawRecords.map(record => alipayTransformer.transform(record as AlipayRecord));
        transactions = allTransactions.filter(transaction => {
          const description = transaction.description || '';
          
          // 检查商品说明是否包含任何跳过模式
          const shouldSkip = ALIPAY_SKIP_PATTERNS.some(pattern => 
            description.includes(pattern)
          );
          
          return !shouldSkip;
        });
        
        return { transactions, rawRecords };
      }
      
      // 检查是否是微信文件
      if (text.includes(PLATFORM_IDENTIFIERS[Platform.WEPAY].identifier)) {
        const csvData = extractTransactionList(text, PLATFORM_IDENTIFIERS[Platform.WEPAY].identifier);
        rawRecords = parseCsv<WepayRecord>(csvData).reverse();
        transactions = rawRecords.map(record => wepayTransformer.transform(record as WepayRecord));
        return { transactions, rawRecords };
      }

      throw new Error('Unsupported file format');
    },

    fillForm: (transaction: Transaction, guessData: GuessData): Promise<void> => {
      return processor.fillForm(transaction, guessData);
    },

    canAutoSave: (transaction: Transaction, guessData: GuessData): boolean => {
      return processor.canAutoSave(transaction, guessData);
    },

    save: async (state: { currentTransaction: Transaction | null; guessData: GuessData }, autoSave: boolean): Promise<void> => {
      if (!state.currentTransaction) return;

      if (!autoSave) {
        const newGuessData = processor.learn(state.currentTransaction, state.guessData, false);
        state.guessData = newGuessData;
        await saveGuessData(newGuessData);
      }

      await processor.save();
      await new Promise(resolve => setTimeout(resolve, 1500));
    },

    saveWithConfidence: async (state: { currentTransaction: Transaction | null; guessData: GuessData }): Promise<void> => {
      if (!state.currentTransaction) return;

      const newGuessData = processor.learn(state.currentTransaction, state.guessData, true);
      state.guessData = newGuessData;
      await saveGuessData(newGuessData);
      await processor.save();
    },
  };
}; 