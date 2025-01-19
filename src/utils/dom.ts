export function createButton(text: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

export function createFileInput(onChange: (event: Event) => void): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.addEventListener('change', onChange);
  return input;
}

export function createPanel(styles: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const panel = document.createElement('div');
  Object.assign(panel.style, styles);
  return panel;
}

export function setValue(selector: string, value: string): void {
  const element = document.querySelector(selector) as HTMLInputElement;
  if (element) {
    element.value = value;
  }
} 