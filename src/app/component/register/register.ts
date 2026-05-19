import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../services/account';
import { RegisterModel } from '../../models/user.model';

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

  constructor(private account: Account, private router: Router) {}

  onRegister() {
    this.account.register(this.registerData).subscribe({
      next: (res) => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
