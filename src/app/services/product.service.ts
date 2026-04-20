import { Injectable } from '@angular/core';
import { CreateProductModel, PaginatedResult, ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  baseUrl: string = 'https://localhost:7049/api/';
  
  constructor(private http: HttpClient) { }
  
  getProducts(pageNumber: number, pageSize: number) {

    return this.http.get<PaginatedResult<ProductModel>>(`${this.baseUrl}product`, {
      params: {
        pageNumber,
        pageSize
      }
    });
  }

  AddProduct(productData: CreateProductModel) {{
    return this.http.post(`${this.baseUrl}product`, productData );
  }}

  getCategories() {
  return this.http.get<any[]>('https://localhost:7049/api/category');
}


}

