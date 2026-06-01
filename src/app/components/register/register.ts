import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../services/account';
import { RegisterModel } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: RegisterModel = {
    fullName: '',
    username: '',
    email: '',
    password: ''
  };

  isLoading = false;
  showPassword = false;

  constructor(
    private account: Account,
    private router: Router,
    private toast: ToastService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.toast.info('Creating Account', 'Submitting registration details...');

    this.account.register(this.registerData).subscribe({
      next: (res) => {
        this.isLoading = false;
        // In the existing backend, registration either logs them in immediately if it returns AuthModel,
        // or requires login. We'll show success and route to home (if authenticated) or login.
        // Let's check if the response has token and is authenticated.
        if (res && res.isAuthenticated) {
          this.toast.success('Registration successful!', `Welcome, ${res.username}!`);
          this.router.navigate(['/home']);
        } else {
          this.toast.success('Registration successful!', 'Please sign in with your credentials.');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        const errMsg = err.error?.message || err.error?.title || 'Could not complete registration';
        this.toast.error('Registration failed', errMsg);
      }
    });
  }
}
