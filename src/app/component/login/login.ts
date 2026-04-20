import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../models/user.model';
import { Account } from '../../services/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule , FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginData: LoginModel = {
    email: '',
    password: ''
  }

  constructor(private account: Account , private router: Router){}

  onLogin(){
    this.account.login(this.loginData).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
        alert("Login Failed: " + error.error.message);
      }
    });

  }



}
