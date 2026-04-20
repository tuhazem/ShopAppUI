import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router){}
  
  onLogout(){
    localStorage.removeItem('ShopToken');
    alert("Logged out successfully!");
    this.router.navigate(['/login']);
  }

}
