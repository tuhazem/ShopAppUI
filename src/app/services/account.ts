import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/user.model';
import { map } from 'rxjs';

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


}
