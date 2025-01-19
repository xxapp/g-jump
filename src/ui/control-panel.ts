import { createButton, createFileInput, createPanel } from '../utils/dom';

export interface ControlPanelHandlers {
  onFileUpload: (file: File) => Promise<void>;
  onStart: () => void;
  onNext: () => void;
  onSave: () => Promise<void>;
  onSaveWithConfidence: () => Promise<void>;
}

export const createControlPanel = (container: HTMLElement) => {
  const panel = createPanel({
    position: 'absolute',
    right: '0',
    top: '0',
    background: 'black',
    color: 'white',
    zIndex: '99999999999',
    width: '250px',
    padding: '10px',
  });

  const fileInput = createFileInput(() => {});
  const startButton = createButton('Start', () => {});
  const nextButton = createButton('Next', () => {});
  const saveButton = createButton('Save', () => {});
  const saveWithConfidenceButton = createButton('!', () => {});

  panel.appendChild(fileInput);
  panel.appendChild(startButton);
  panel.appendChild(nextButton);
  panel.appendChild(saveButton);
  panel.appendChild(saveWithConfidenceButton);

  container.appendChild(panel);

  return {
    onFileUpload: (handler: (file: File) => Promise<void>) => {
      fileInput.onchange = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          await handler(file);
        }
      };
    },

    onStart: (handler: () => void) => {
      startButton.onclick = handler;
    },

    onNext: (handler: () => void) => {
      nextButton.onclick = handler;
    },

    onSave: (handler: () => Promise<void>) => {
      saveButton.onclick = async () => {
        await handler();
      };
    },

    onSaveWithConfidence: (handler: () => Promise<void>) => {
      saveWithConfidenceButton.onclick = async () => {
        await handler();
      };
    },

    destroy: () => {
      panel.remove();
    },
  };
}; 