import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDTO, CreateCategoryCommand, UpdateCategoryCommand } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl: string = 'https://localhost:7049/api/category';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.baseUrl);
  }

  getCategory(id: number): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(`${this.baseUrl}/${id}`);
  }

  createCategory(command: CreateCategoryCommand): Observable<any> {
    return this.http.post(this.baseUrl, command);
  }

  updateCategory(id: number, command: UpdateCategoryCommand): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, command);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
