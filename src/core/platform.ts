import { GuessData, Transaction } from '../types/transaction';
import { Platform, PlatformIdentifier } from '../types/platform';

export interface IPlatform {
  readonly platform: Platform;
  readonly identifier: PlatformIdentifier;
  
  // 初始化平台
  initialize(): Promise<void>;
  
  // 处理文件上传
  handleFileUpload(file: File): Promise<void>;
  
  // 获取当前交易记录
  getCurrentTransaction(): Transaction | null;
  
  // 移动到下一条记录
  next(): void;
  
  // 保存当前记录
  save(autoSave?: boolean): Promise<void>;
  
  // 保存并标记为高置信度
  saveWithConfidence(): Promise<void>;
  
  // 获取学习数据
  getGuessData(): Promise<GuessData>;
  
  // 更新学习数据
  updateGuessData(data: GuessData): Promise<void>;
} 