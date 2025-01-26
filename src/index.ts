import { createControlPanel, createInfoPanel } from './ui';
import { createSuiPlatform } from './platforms/sui';
import { Transaction } from './types/transaction';
import { AlipayRecord, WepayRecord } from './platforms/sui/types';

// 应用状态类型
interface AppState {
  currentTransaction: Transaction | null;
  currentRawRecord: (AlipayRecord | WepayRecord) | null;
  guessData: any;
  transactions: Transaction[];
  rawRecords: (AlipayRecord | WepayRecord)[];
  currentIndex: number;
}

// 创建初始状态
const createInitialState = (): AppState => ({
  currentTransaction: null,
  currentRawRecord: null,
  guessData: null,
  transactions: [],
  rawRecords: [],
  currentIndex: 0,
});

// 主程序
const main = async () => {
  // 创建状态
  let state = createInitialState();

  // 创建平台
  const platform = createSuiPlatform();

  // 创建 UI 组件
  const controlPanel = createControlPanel(document.body);
  const infoPanel = createInfoPanel(document.body);

  // 处理当前交易
  const processTransaction = async (transaction: Transaction, rawRecord: AlipayRecord | WepayRecord) => {
    const guessData = state.guessData;
    
    // 显示交易信息
    infoPanel.showTransaction(rawRecord);

    // 填充表单
    platform.fillForm(transaction, guessData);

    // 检查是否可以自动保存
    if (platform.canAutoSave(transaction, guessData)) {
      await platform.save(state, true);
      state = {
        ...state,
        currentIndex: state.currentIndex + 1,
        currentTransaction: state.transactions[state.currentIndex + 1] || null,
        currentRawRecord: state.rawRecords[state.currentIndex + 1] || null,
      };
      if (state.currentTransaction && state.currentRawRecord) {
        await processTransaction(state.currentTransaction, state.currentRawRecord);
      }
    }
  };

  // 处理错误
  const handleError = (error: Error) => {
    console.error(error);
    infoPanel.showError(error);
  };

  // 初始化
  try {
    state.guessData = await platform.initialize();
    
    // 文件上传处理
    controlPanel.onFileUpload(async (file) => {
      try {
        const result = await platform.handleFileUpload(file);
        state = {
          ...state,
          transactions: result.transactions,
          rawRecords: result.rawRecords,
          currentIndex: 0,
          currentTransaction: result.transactions[0] || null,
          currentRawRecord: result.rawRecords[0] || null,
        };
        if (state.currentTransaction && state.currentRawRecord) {
          await processTransaction(state.currentTransaction, state.currentRawRecord);
        }
      } catch (error) {
        handleError(error as Error);
      }
    });

    // 开始处理
    controlPanel.onStart(async () => {
      try {
        if (state.currentTransaction && state.currentRawRecord) {
          await processTransaction(state.currentTransaction, state.currentRawRecord);
        }
      } catch (error) {
        handleError(error as Error);
      }
    });

    // 下一条记录
    controlPanel.onNext(async () => {
      try {
        state = {
          ...state,
          currentIndex: state.currentIndex + 1,
          currentTransaction: state.transactions[state.currentIndex + 1] || null,
          currentRawRecord: state.rawRecords[state.currentIndex + 1] || null,
        };
        if (state.currentTransaction && state.currentRawRecord) {
          await processTransaction(state.currentTransaction, state.currentRawRecord);
        } else {
          infoPanel.clear();
        }
      } catch (error) {
        handleError(error as Error);
      }
    });

    // 保存记录
    controlPanel.onSave(async () => {
      try {
        if (state.currentTransaction) {
          await platform.save(state, false);
          state = {
            ...state,
            currentIndex: state.currentIndex + 1,
            currentTransaction: state.transactions[state.currentIndex + 1] || null,
            currentRawRecord: state.rawRecords[state.currentIndex + 1] || null,
          };
          if (state.currentTransaction && state.currentRawRecord) {
            await processTransaction(state.currentTransaction, state.currentRawRecord);
          } else {
            infoPanel.clear();
          }
        }
      } catch (error) {
        handleError(error as Error);
      }
    });

    // 高置信度保存
    controlPanel.onSaveWithConfidence(async () => {
      try {
        if (state.currentTransaction) {
          await platform.saveWithConfidence(state);
          state = {
            ...state,
            currentIndex: state.currentIndex + 1,
            currentTransaction: state.transactions[state.currentIndex + 1] || null,
            currentRawRecord: state.rawRecords[state.currentIndex + 1] || null,
          };
          if (state.currentTransaction && state.currentRawRecord) {
            await processTransaction(state.currentTransaction, state.currentRawRecord);
          } else {
            infoPanel.clear();
          }
        }
      } catch (error) {
        handleError(error as Error);
      }
    });

  } catch (error) {
    handleError(error as Error);
  }
};

// 启动应用
main(); 