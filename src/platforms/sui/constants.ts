import { Platform, PlatformIdentifier } from '../../types/platform';

export const IDENTIFIER_ALIPAY = '支付宝（中国）网络技术有限公司  电子客户回单';
export const IDENTIFIER_WEPAY = '微信支付账单明细列表';

export const PLATFORM_IDENTIFIERS: Record<Platform, PlatformIdentifier> = {
  [Platform.ALIPAY]: {
    name: 'Alipay',
    identifier: IDENTIFIER_ALIPAY,
    encoding: 'GBK',
  },
  [Platform.WEPAY]: {
    name: 'WeChat Pay',
    identifier: IDENTIFIER_WEPAY,
    encoding: 'utf-8',
  },
};

export const DESCRIPTION_SAMPLES = ['停车', '停管家'];

// 支付宝记录跳过配置 - 包含这些子字符串的记录将被跳过
export const ALIPAY_SKIP_PATTERNS = ['长盛安逸纯债债券A-买入'];

// Sui 平台特定的选择器
export const SELECTORS = {
  outMoney: '#tb-outMoney-1',
  inMoney: '#tb-inMoney-5',
  outAccount: '#tb-outAccount-1',
  outAccountText: '#tb-outAccount-1_text',
  inAccount: '#tb-inAccount-5',
  inAccountText: '#tb-inAccount-5_text',
  outCategory: '#tb-category-1',
  outCategoryText: '#tb-category-1_text',
  inCategory: '#tb-category-5',
  inCategoryText: '#tb-category-5_text',
  project: '#tb-project',
  projectText: '#tb-project_text',
  datePicker: '#tb-datepicker',
  typeSelector: '.tm-n.select',
}; 