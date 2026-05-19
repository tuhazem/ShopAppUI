import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService, DashboardStatsDto } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStatsDto;
  today: Date = new Date();
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Times Sold', backgroundColor: '#6366f1', borderRadius: 8 }
    ]
  };

  public lowStockChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Current Stock', backgroundColor: '#ef4444', borderRadius: 8 }
    ]
  };

  constructor(private ds: DashboardService) {}

  ngOnInit(): void {
    this.ds.getStatus().subscribe(res => {
      this.stats = res;

      // Top Selling Products Chart
      this.barChartData.labels = res.topSellingProducts.map(p => p.productName);
      this.barChartData.datasets[0].data = res.topSellingProducts.map(p => p.timesSold);
      this.barChartData = { ...this.barChartData };

      // Low Stock Products Chart
      this.lowStockChartData.labels = res.lowStockAlert.map(p => p.productName);
      this.lowStockChartData.datasets[0].data = res.lowStockAlert.map(p => p.currentStock);
      this.lowStockChartData = { ...this.lowStockChartData };
    });
  }
}
