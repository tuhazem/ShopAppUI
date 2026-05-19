import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Home } from './components/home/home';
import { Customers } from './components/customers/customers';
import { Orders } from './components/orders/orders';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'home', component: Home , canActivate: [authGuard] },
    { path: 'customers', component: Customers, canActivate: [authGuard] },
    { path: 'orders', component: Orders, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
