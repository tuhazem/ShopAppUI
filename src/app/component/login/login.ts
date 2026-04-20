import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../models/user.model';
import { Account } from '../../services/account';

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

  constructor(private account: Account){}

  onLogin(){
    this.account.login(this.loginData).subscribe({
      next: (response) => {
        console.log(response);
        alert( "Login Successful: " + response.username);
      },
      error: (error) => {
        console.log(error);
        alert("Login Failed: " + error.error.message);
      }
    });

  }



}
