import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, CreateOrderCommand } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { ActionService } from '../../services/action.service';
import { ProductDTO } from '../../models/product.model';
import { CustomerDTO } from '../../models/customer.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: any[] = [];
  products: ProductDTO[] = [];
  customers: CustomerDTO[] = [];
  
  newOrder: CreateOrderCommand = { customerId: 0, items: [] };
  selectedProductId: number = 0;
  selectedQuantity: number = 1;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadData();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(res => {
      this.orders = res.items || res;
    });
  }

  loadData() {
    this.productService.getProducts(1, 100).subscribe(res => {
      this.products = res?.items || [];
    });
    this.customerService.getCustomers().subscribe(res => {
      this.customers = res?.items || res || [];
    });
  }

  addItem() {
    if (this.selectedProductId && this.selectedQuantity > 0) {
      const prodId = Number(this.selectedProductId);
      const existingItem = this.newOrder.items.find(i => i.productId === prodId);
      
      if (existingItem) {
        existingItem.quantity += this.selectedQuantity;
      } else {
        this.newOrder.items.push({ productId: prodId, quantity: this.selectedQuantity });
      }
      
      this.selectedProductId = 0;
      this.selectedQuantity = 1;
    }
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  getProductName(id: number) {
    return this.products.find(p => p.id === id)?.name || 'Unknown';
  }

  createOrder() {
    if (this.newOrder.customerId && this.newOrder.items.length > 0) {
      // Ensure customerId is a number
      this.newOrder.customerId = Number(this.newOrder.customerId);
      
      this.orderService.createOrder(this.newOrder).subscribe({
        next: (res) => {
          alert(res.message || 'Order created successfully');
          this.loadOrders();
          this.newOrder = { customerId: 0, items: [] };
        },
        error: (err) => {
          console.error('Order creation failed:', err);
          const errorMsg = err.error?.message || err.error?.title || 'Check stock levels or Customer ID';
          alert('Order failed: ' + errorMsg);
        }
      });
    } else {
      alert('Please select a customer and add at least one item.');
    }
  }

  downloadInvoice(id: number) {
    this.actionService.downloadInvoice(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
