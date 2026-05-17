import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/user.model';
import { map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Account {

  baseUrl: string = 'https://localhost:7049/api/Auth/';

  constructor(private http: HttpClient) { }
  
  login(model:any){

    return this.http.post<AuthModel>(this.baseUrl + 'login', model).pipe(

      map((response: AuthModel)=>{

        if(response && response.token){
          localStorage.setItem('ShopToken', JSON.stringify(response));
        }
        return response;
      })
    );
  }

  logout(){
    localStorage.removeItem('ShopToken');
  }

  isAdmin(): boolean {
    const data = localStorage.getItem('ShopToken');
    if (!data) return false;

    try {
      const authModel: AuthModel = JSON.parse(data);
      const token = authModel.token;
      const decoded: any = jwtDecode(token);

      const role = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      return role === 'Admin';
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('ShopToken');
  }


}
