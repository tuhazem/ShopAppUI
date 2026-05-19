import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDTO, CreateProductCommand, PaginatedResult } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'https://localhost:7049/api/Product';
  
  constructor(private http: HttpClient) { }
  
  getProducts(pageNumber: number = 1, pageSize: number = 10, searchTerm?: string, minPrice?: number, maxPrice?: number): Observable<PaginatedResult<ProductDTO>> {
    let params: any = { pageNumber, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    return this.http.get<PaginatedResult<ProductDTO>>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.baseUrl}/${id}`);
  }

  createProduct(command: CreateProductCommand): Observable<any> {
    return this.http.post(this.baseUrl, command);
  }

  updateProduct(id: number, command: CreateProductCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
