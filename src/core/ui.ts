import { Transaction } from '../types/transaction';

export interface IUIComponent {
  // 初始化组件
  initialize(): void;
  
  // 更新显示内容
  update(data: unknown): void;
  
  // 销毁组件
  destroy(): void;
}

export interface IControlPanel extends IUIComponent {
  // 添加文件上传处理
  onFileUpload(handler: (file: File) => Promise<void>): void;
  
  // 添加开始按钮处理
  onStart(handler: () => void): void;
  
  // 添加下一步按钮处理
  onNext(handler: () => void): void;
  
  // 添加保存按钮处理
  onSave(handler: () => Promise<void>): void;
  
  // 添加高置信度保存按钮处理
  onSaveWithConfidence(handler: () => Promise<void>): void;
}

export interface IInfoPanel extends IUIComponent {
  // 显示交易信息
  showTransaction(transaction: Transaction): void;
  
  // 显示错误信息
  showError(error: Error): void;
  
  // 清除显示内容
  clear(): void;
} 