import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateOrderCommand {
    customerId: number;
    items: { productId: number; quantity: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl: string = 'https://localhost:7049/api/Order';

  constructor(private http: HttpClient) {}

  createOrder(command: CreateOrderCommand): Observable<any> {
    return this.http.post<any>(this.baseUrl, command);
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetAll`);
  }
}
