import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel, LoginModel, RegisterModel } from '../models/user.model';
import { map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Account {
  private baseUrl: string = 'https://localhost:7049/api/Auth/';

  constructor(private http: HttpClient) { }
  
  login(model: LoginModel) {
    return this.http.post<AuthModel>(this.baseUrl + 'Login', model).pipe(
      map((response: AuthModel) => {
        if (response && response.token) {
          localStorage.setItem('ShopToken', JSON.stringify(response));
        }
        return response;
      })
    );
  }

  register(model: RegisterModel) {
    return this.http.post<AuthModel>(this.baseUrl + 'Register', model).pipe(
      map((response: AuthModel) => {
        if (response && response.token) {
          localStorage.setItem('ShopToken', JSON.stringify(response));
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('ShopToken');
  }

  isAdmin(): boolean {
    const data = localStorage.getItem('ShopToken');
    if (!data) return false;
    try {
      const authModel: AuthModel = JSON.parse(data);
      const decoded: any = jwtDecode(authModel.token);
      const roles = decoded['roles'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('ShopToken');
  }

  getUsername(): string {
    const data = localStorage.getItem('ShopToken');
    if (!data) return '';
    const authModel: AuthModel = JSON.parse(data);
    return authModel.username;
  }
}
