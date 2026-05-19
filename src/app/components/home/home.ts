import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActionService } from '../../services/action.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { ProductDTO, PaginatedResult } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  products: ProductDTO[] = [];
  pageNumber: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  totalCount: number = 0;
  
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private actionService: ActionService,
    private orderService: OrderService,
    private customerService: CustomerService
  ) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.pageNumber = 1;
      this.loadProducts();
    });
  }
  
  ngOnInit(): void {
    this.loadProducts();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  loadProducts() {
    this.productService.getProducts(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (result) => {
        this.products = result.items;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageNumber = newPage;
      this.loadProducts();
    }
  }

  quickOrder(product: ProductDTO) {
    const customerIdStr = prompt(`Ordering ${product.name}. Enter Customer ID:`, "1");
    if (!customerIdStr) return;
    
    const customerId = Number(customerIdStr);
    if (isNaN(customerId)) {
      alert('Invalid Customer ID. Please enter a number.');
      return;
    }

    const quantityStr = prompt(`Enter Quantity:`, "1");
    if (!quantityStr) return;
    
    const quantity = Number(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Invalid quantity. Please enter a positive number.');
      return;
    }

    if (quantity > product.stock) {
      alert(`Insufficient stock. Only ${product.stock} available.`);
      return;
    }

    this.orderService.createOrder({
      customerId: customerId,
      items: [{ productId: product.id, quantity: quantity }]
    }).subscribe({
      next: (res) => {
        alert(res.message || 'Order created successfully!');
        this.loadProducts(); // Refresh to see updated stock
      },
      error: (err) => {
        console.error('Quick order failed:', err);
        const errorMsg = err.error?.message || err.error?.title || 'Check Customer ID or stock levels';
        alert('Order failed: ' + errorMsg);
      }
    });
  }

  downloadInventory() {
    this.actionService.downloadInventory().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Inventory.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
