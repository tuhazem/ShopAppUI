import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  exiting?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  private _nextId = 0;

  readonly toasts = computed(() => this._toasts());

  show(type: Toast['type'], title: string, message: string, duration = 4000): void {
    const id = ++this._nextId;
    const toast: Toast = { id, type, title, message };
    this._toasts.update(t => [...t, toast]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(title: string, message = ''): void {
    this.show('success', title, message);
  }

  error(title: string, message = ''): void {
    this.show('error', title, message, 6000);
  }

  warning(title: string, message = ''): void {
    this.show('warning', title, message, 5000);
  }

  info(title: string, message = ''): void {
    this.show('info', title, message);
  }

  dismiss(id: number): void {
    this._toasts.update(toasts =>
      toasts.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      this._toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, 300);
  }
}
