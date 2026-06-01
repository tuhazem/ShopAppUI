import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActionService } from '../../services/action.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { ProductDTO } from '../../models/product.model';
import { CustomerDTO } from '../../models/customer.model';
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
  customers: CustomerDTO[] = [];
  
  // Pagination & Search
  pageNumber = 1;
  pageSize = 8;
  totalPages = 0;
  totalCount = 0;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // State flags
  isLoadingProducts = false;
  isDownloadingReport = false;
  isOrdering = false;

  // Drawer state for Quick Order
  isDrawerOpen = false;
  selectedProduct: ProductDTO | null = null;
  orderQuantity = 1;
  selectedCustomerId: number | null = null;
  customerSearchTerm = '';

  constructor(
    private productService: ProductService,
    private actionService: ActionService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private toast: ToastService
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
    this.loadCustomers();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  loadProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (result) => {
        this.products = result.items;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.toast.error('Fetch Failed', 'Could not load inventory items.');
        this.isLoadingProducts = false;
      }
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        // Handle if response is array or wrapped
        this.customers = Array.isArray(res) ? res : (res.items || []);
      },
      error: (err) => console.error('Error loading customers:', err)
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageNumber = newPage;
      this.loadProducts();
    }
  }

  // Quick Order Drawer Actions
  openQuickOrderDrawer(product: ProductDTO) {
    if (product.stock <= 0) {
      this.toast.warning('Out of Stock', `${product.name} is currently unavailable.`);
      return;
    }
    this.selectedProduct = product;
    this.orderQuantity = 1;
    this.selectedCustomerId = this.customers.length > 0 ? this.customers[0].id : null;
    this.customerSearchTerm = '';
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedProduct = null;
  }

  incrementQuantity() {
    if (this.selectedProduct && this.orderQuantity < this.selectedProduct.stock) {
      this.orderQuantity++;
    }
  }

  decrementQuantity() {
    if (this.orderQuantity > 1) {
      this.orderQuantity--;
    }
  }

  get filteredCustomers() {
    if (!this.customerSearchTerm) return this.customers;
    return this.customers.filter(c => 
      c.name.toLowerCase().includes(this.customerSearchTerm.toLowerCase()) ||
      c.id.toString().includes(this.customerSearchTerm)
    );
  }

  submitQuickOrder() {
    if (!this.selectedProduct || !this.selectedCustomerId || this.isOrdering) return;

    if (this.orderQuantity > this.selectedProduct.stock) {
      this.toast.error('Insufficient Stock', `Only ${this.selectedProduct.stock} left in stock.`);
      return;
    }

    this.isOrdering = true;
    this.toast.info('Placing Order', 'Creating order transaction...');

    this.orderService.createOrder({
      customerId: this.selectedCustomerId,
      items: [{ productId: this.selectedProduct.id, quantity: this.orderQuantity }]
    }).subscribe({
      next: (res) => {
        this.isOrdering = false;
        this.toast.success('Order Placed', res.message || 'Quick order successfully completed!');
        this.closeDrawer();
        this.loadProducts(); // Refresh products to reflect new stock
      },
      error: (err) => {
        this.isOrdering = false;
        console.error('Quick order failed:', err);
        const errorMsg = err.error?.message || err.error?.title || 'Check credentials or stock level.';
        this.toast.error('Order Failed', errorMsg);
      }
    });
  }

  downloadInventory() {
    if (this.isDownloadingReport) return;
    this.isDownloadingReport = true;
    this.toast.info('Downloading Report', 'Preparing Excel spreadsheet...');

    this.actionService.downloadInventory().subscribe({
      next: (blob) => {
        this.isDownloadingReport = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Inventory_Report_${new Date().toISOString().slice(0,10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Download Complete', 'Excel report saved successfully.');
      },
      error: (err) => {
        this.isDownloadingReport = false;
        console.error(err);
        this.toast.error('Download Failed', 'Could not generate inventory spreadsheet.');
      }
    });
  }
}
