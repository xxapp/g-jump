import { IUIComponent } from '../core/ui';

export abstract class BaseComponent implements IUIComponent {
  protected element: HTMLElement;

  constructor(protected container: HTMLElement) {
    this.element = document.createElement('div');
    this.container.appendChild(this.element);
  }

  abstract initialize(): void;

  update(data: unknown): void {
    // 基类提供默认的空实现，子类可以根据需要重写
  }

  destroy(): void {
    this.element.remove();
  }

  protected setStyles(styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(this.element.style, styles);
  }
} 