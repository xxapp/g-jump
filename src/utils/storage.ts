import { GuessData } from '../types/transaction';

export async function loadGuessData(): Promise<GuessData> {
  const defaultData: GuessData = {
    counterparty: {},
    account: {},
    description: {},
  };

  try {
    const data = await GM.getValue('guess', defaultData);
    return data as GuessData;
  } catch (error) {
    console.error('Failed to load guess data:', error);
    return defaultData;
  }
}

export async function saveGuessData(data: GuessData): Promise<void> {
  try {
    await GM.setValue('guess', data);
  } catch (error) {
    console.error('Failed to save guess data:', error);
  }
} 