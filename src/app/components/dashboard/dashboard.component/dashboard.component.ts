import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard.component',
  imports: [CommonModule , BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  stats: any;
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive:true,
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels:[],
    datasets :[
      { data : [] , label: "Top Product"  , backgroundColor:'#3f51b5'}
    ]
  };

  public lowStockChartData: ChartData<'bar'> = {
    labels:[],
    datasets :[
      { data : [] , label: "Stock Quantity"  , backgroundColor:'#f44336'}
    ]
  };

  constructor(private ds : DashboardService){ }

  ngOnInit(): void {
    this.ds.getStatus().subscribe(res => {
      this.stats = res;

      // Top Selling Products Chart
      this.barChartData.labels = res.topSellingProducts.map((p:any) => p.productName);
      this.barChartData.datasets[0].data = res.topSellingProducts.map((p: any) => p.timesSold);
      this.barChartData = { ...this.barChartData };

      // Low Stock Products Chart
      if (res.lowStockAlert) {
        this.lowStockChartData.labels = res.lowStockAlert.map((p: any) => p.productName);
        this.lowStockChartData.datasets[0].data = res.lowStockAlert.map((p: any) => p.currentStock);
        this.lowStockChartData = { ...this.lowStockChartData };
      }
    })
  }
}
