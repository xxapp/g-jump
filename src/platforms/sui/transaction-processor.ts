import { GuessData, Transaction, TransactionStatus, TransactionType } from '../../types/transaction';
import { DESCRIPTION_SAMPLES, SELECTORS } from './constants';
import { setValue } from '../../utils';

declare const billManager: {
  changeType(type: number): void;
  data: {
    add(): void;
  };
};

declare const levelSelect: {
  choose(type: string, text: string, id: number): void;
};

interface GuessResult {
  category?: [string, string, number];
  account?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

export const createTransactionProcessor = () => {
  const guessFields = (transaction: Transaction, guessData: GuessData): GuessResult => {
    const result: GuessResult = {};
    const counterpartyGuess = guessData.counterparty[transaction.counterparty];
    const accountGuess = guessData.account[transaction.account];
    const descriptionGuess = Object.keys(guessData.description)
      .filter((key) => transaction.description.includes(key))
      .map((key) => guessData.description[key])[0];

    if (counterpartyGuess) {
      result.category = counterpartyGuess.category;
    }

    if (accountGuess) {
      result.account = accountGuess.account;
    }

    if (descriptionGuess) {
      result.project = descriptionGuess.project;
      if (!result.category) {
        result.category = descriptionGuess.category;
      }
    }

    return result;
  };

  return {
    fillForm: async (transaction: Transaction, guessData: GuessData): Promise<void> => {
      const { type, amount, time } = transaction;
      const guess = guessFields(transaction, guessData);

      if (type === TransactionType.OUT || transaction.status === TransactionStatus.REFUND) {
        billManager.changeType(1);
        await new Promise(resolve => setTimeout(resolve, 500));
        setValue(SELECTORS.outMoney, String(amount * (transaction.status === TransactionStatus.REFUND ? -1 : 1)));
        if (guess.account) {
          setValue(SELECTORS.outAccountText, guess.account.name);
          setValue(SELECTORS.outAccount, guess.account.id);
        }
      } else if (type === TransactionType.IN) {
        billManager.changeType(5);
        await new Promise(resolve => setTimeout(resolve, 500));
        setValue(SELECTORS.inMoney, String(amount));
        if (guess.account) {
          setValue(SELECTORS.inAccountText, guess.account.name);
          setValue(SELECTORS.inAccount, guess.account.id);
        }
      }

      if (guess.category) {
        levelSelect.choose.apply(null, guess.category);
      }

      if (guess.project) {
        setValue(SELECTORS.project, guess.project.id);
        setValue(SELECTORS.projectText, guess.project.name);
      } else {
        setValue(SELECTORS.project, '0');
        setValue(SELECTORS.projectText, '无');
      }

      setValue(SELECTORS.datePicker, time);
    },

    canAutoSave: (transaction: Transaction, guessData: GuessData): boolean => {
      if (transaction.status === TransactionStatus.CANCEL) {
        return true;
      }

      const counterpartyGuess = guessData.counterparty[transaction.counterparty];
      return Boolean(counterpartyGuess?.confident);
    },

    learn: (transaction: Transaction, guessData: GuessData, confident: boolean): GuessData => {
      const elementId = document.querySelector(SELECTORS.typeSelector)?.id;
      if (!elementId) {
        return guessData;
      }

      const type = elementId === 'tm-1' ? 'payout' : 'income';
      const categoryText = (document.querySelector(`#tb-category-${elementId.slice(-1)}_text`) as HTMLInputElement)?.value;
      const categoryId = (document.querySelector(`#tb-category-${elementId.slice(-1)}`) as HTMLInputElement)?.value;
      const accountId = (document.querySelector(elementId === 'tm-1' ? SELECTORS.outAccount : SELECTORS.inAccount) as HTMLInputElement)?.value;
      const accountName = (document.querySelector(elementId === 'tm-1' ? SELECTORS.outAccountText : SELECTORS.inAccountText) as HTMLInputElement)?.value;
      const projectId = (document.querySelector(SELECTORS.project) as HTMLInputElement)?.value;
      const projectName = (document.querySelector(SELECTORS.projectText) as HTMLInputElement)?.value;

      return {
        ...guessData,
        counterparty: {
          ...guessData.counterparty,
          [transaction.counterparty]: {
            category: [type, categoryText, Number(categoryId)],
            confident,
          },
        },
        account: {
          ...guessData.account,
          [transaction.account]: {
            account: { id: accountId, name: accountName },
          },
        },
        description: {
          ...guessData.description,
          ...DESCRIPTION_SAMPLES.reduce((acc, item) => {
            if (transaction.description.includes(item)) {
              return {
                ...acc,
                [item]: {
                  project: { id: projectId, name: projectName },
                  category: [type, categoryText, Number(categoryId)],
                },
              };
            }
            return acc;
          }, {}),
        },
      };
    },

    save: async (): Promise<void> => {
      billManager.data.add();
    },
  };
}; 