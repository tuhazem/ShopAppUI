import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDTO, CreateCustomerCommand, UpdateCustomerCommand } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl: string = 'https://localhost:7049/api/Customer';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  searchCustomer(id?: number, name?: string): Observable<CustomerDTO> {
    let params: any = {};
    if (id) params.id = id;
    if (name) params.name = name;
    return this.http.get<CustomerDTO>(`${this.baseUrl}/search`, { params });
  }

  createCustomer(command: CreateCustomerCommand): Observable<any> {
    return this.http.post(this.baseUrl, command);
  }

  updateCustomer(id: number, command: UpdateCustomerCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  restoreCustomer(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/restore`, {});
  }
}
