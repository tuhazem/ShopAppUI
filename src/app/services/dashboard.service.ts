import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStatsDto {
    totalSalaryToday: number;
    totalOrderToday: number;
    topSellingProducts: { productName: string; timesSold: number }[];
    lowStockAlert: { productName: string; currentStock: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl: string = 'https://localhost:7049/api/Admin/';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>(`${this.baseUrl}dashboard-status`);
  }
}
