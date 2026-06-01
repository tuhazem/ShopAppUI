import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { Account } from './services/account';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, ToastContainerComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public accountService: Account) {}
}

