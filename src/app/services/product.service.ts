import { Injectable } from '@angular/core';
import { CreateProductModel, PaginatedResult, ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  DeleteProduct(id:number): Observable<any>{
      return this.http.delete(`${this.baseUrl}Product/${id}`)
  }

  UpdateProduct(id:number , product: any):Observable<any>{
    return this.http.put(`${this.baseUrl}Product/${id}` , product)
  }


}

