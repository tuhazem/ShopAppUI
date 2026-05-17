import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'home', component: Home , canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
