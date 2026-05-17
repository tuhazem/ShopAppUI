import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiurl = 'https://localhost:7049/api/Admin/dashboard-status'
  constructor(private http:HttpClient){ }

  getStatus(): Observable<any>{
    return this.http.get(this.apiurl);
  }
  
}
