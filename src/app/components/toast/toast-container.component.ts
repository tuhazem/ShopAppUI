import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [class]="toast.type" [class.toast-exit]="toast.exiting">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <i class="bi bi-check-circle-fill"></i> }
              @case ('error') { <i class="bi bi-x-circle-fill"></i> }
              @case ('warning') { <i class="bi bi-exclamation-triangle-fill"></i> }
              @case ('info') { <i class="bi bi-info-circle-fill"></i> }
            }
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            @if (toast.message) {
              <div class="toast-message">{{ toast.message }}</div>
            }
          </div>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
