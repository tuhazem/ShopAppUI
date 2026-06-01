import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../services/account';
import { LoginModel } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData: LoginModel = {
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

  onLogin() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.toast.info('Authenticating', 'Checking your credentials...');

    this.account.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isAuthenticated) {
          this.toast.success('Welcome back!', `Logged in as ${res.username}`);
          this.router.navigate(['/home']);
        } else {
          this.toast.error('Authentication failed', res.message || 'Check your credentials');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        const errMsg = err.error?.message || err.error?.title || 'Invalid email or password';
        this.toast.error('Authentication error', errMsg);
      }
    });
  }
}
