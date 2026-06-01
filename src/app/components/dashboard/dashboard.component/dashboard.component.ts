import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService, DashboardStatsDto } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ToastService } from '../../../services/toast.service';

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
  isLoading = false;
  
  // Custom Dark Configured Chart Options
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#151821',
        titleColor: '#f0f1f3',
        bodyColor: '#8b8fa3',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { family: 'Inter', weight: 'bold', size: 12 },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { 
          color: '#8b8fa3', 
          font: { family: 'Inter', size: 10, weight: 500 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#8b8fa3', 
          font: { family: 'Inter', size: 10, weight: 500 }
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  
  // Chart Data definitions with HSL themed colors
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Times Sold', 
        backgroundColor: '#6366f1', 
        hoverBackgroundColor: '#818cf8',
        borderRadius: 6,
        barThickness: 16
      }
    ]
  };

  public lowStockChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Current Stock', 
        backgroundColor: '#ef4444', 
        hoverBackgroundColor: '#f87171',
        borderRadius: 6,
        barThickness: 16
      }
    ]
  };

  constructor(
    private ds: DashboardService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.ds.getStatus().subscribe({
      next: (res) => {
        this.stats = res;

        // Top Selling Products Chart
        this.barChartData.labels = res.topSellingProducts.map(p => p.productName);
        this.barChartData.datasets[0].data = res.topSellingProducts.map(p => p.timesSold);
        this.barChartData = { ...this.barChartData };

        // Low Stock Products Chart
        this.lowStockChartData.labels = res.lowStockAlert.map(p => p.productName);
        this.lowStockChartData.datasets[0].data = res.lowStockAlert.map(p => p.currentStock);
        this.lowStockChartData = { ...this.lowStockChartData };

        this.isLoading = false;
        this.toast.success('Analytics Synchronized', 'Telemetry statistics loaded.');
      },
      error: (err) => {
        console.error('Error fetching dashboard stats:', err);
        this.toast.error('Failed to sync metrics', 'Could not query telemetry dashboard stats.');
        this.isLoading = false;
      }
    });
  }
}
