import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../services/account';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router , public accountService:Account){}
  
  onLogout(){
    this.accountService.logout();
    alert("Logged out successfully!");
    this.router.navigate(['/login']);
  }
  

}
