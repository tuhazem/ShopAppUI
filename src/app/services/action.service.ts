import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private baseUrl: string = 'https://localhost:7049/api/Action';

  constructor(private http: HttpClient) {}

  downloadInventory(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-inventory`, { responseType: 'blob' });
  }

  downloadInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/order-invoice/${orderId}`, { responseType: 'blob' });
  }
}
