import { Transaction } from '../types/transaction';
import { createPanel } from '../utils/dom';

export const createInfoPanel = (container: HTMLElement) => {
  const panel = createPanel({
    position: 'absolute',
    right: '0',
    top: '50px',
    background: 'black',
    color: 'white',
    zIndex: '99999999999',
    width: '250px',
    padding: '10px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  });

  container.appendChild(panel);

  return {
    showTransaction: (transaction: Transaction) => {
      panel.innerHTML = JSON.stringify(transaction, null, 2).replace(/\n/g, '<br>');
    },

    showError: (error: Error) => {
      panel.innerHTML = `
        <div style="color: red;">
          Error: ${error.message}
        </div>
      `;
    },

    clear: () => {
      panel.innerHTML = '';
    },

    destroy: () => {
      panel.remove();
    },
  };
}; 