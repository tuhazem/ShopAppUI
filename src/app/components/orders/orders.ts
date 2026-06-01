import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, CreateOrderCommand } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { ActionService } from '../../services/action.service';
import { ToastService } from '../../services/toast.service';
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
  
  // Create Order Form State
  newOrder: CreateOrderCommand = { customerId: 0, items: [] };
  selectedProductId = 0;
  selectedQuantity = 1;

  // UI States
  isLoadingOrders = false;
  isSubmittingOrder = false;
  isModalOpen = false;
  
  // Track downloading invoices
  downloadingInvoiceIds = new Set<number>();

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private actionService: ActionService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadData();
  }

  loadOrders() {
    this.isLoadingOrders = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.items || res || [];
        this.isLoadingOrders = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.toast.error('Failed to load orders', 'Could not query transaction history.');
        this.isLoadingOrders = false;
      }
    });
  }

  loadData() {
    this.productService.getProducts(1, 200).subscribe({
      next: (res) => {
        this.products = res?.items || [];
      },
      error: (err) => console.error('Error loading products:', err)
    });

    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = Array.isArray(res) ? res : (res.items || []);
      },
      error: (err) => console.error('Error loading customers:', err)
    });
  }

  openModal() {
    this.newOrder = { customerId: this.customers.length > 0 ? this.customers[0].id : 0, items: [] };
    this.selectedProductId = this.products.length > 0 ? this.products[0].id : 0;
    this.selectedQuantity = 1;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addItem() {
    if (!this.selectedProductId || this.selectedQuantity <= 0) {
      this.toast.warning('Invalid Selection', 'Please choose a product and set quantity.');
      return;
    }

    const prodId = Number(this.selectedProductId);
    const product = this.products.find(p => p.id === prodId);
    
    if (!product) return;

    if (this.selectedQuantity > product.stock) {
      this.toast.error('Insufficient Stock', `Only ${product.stock} items left in stock.`);
      return;
    }

    const existingItem = this.newOrder.items.find(i => i.productId === prodId);
    
    if (existingItem) {
      const newQty = existingItem.quantity + this.selectedQuantity;
      if (newQty > product.stock) {
        this.toast.error('Insufficient Stock', `Cannot exceed stock limit of ${product.stock}.`);
        return;
      }
      existingItem.quantity = newQty;
    } else {
      this.newOrder.items.push({ productId: prodId, quantity: this.selectedQuantity });
    }
    
    this.toast.success('Item Added', `${product.name} (x${this.selectedQuantity}) added to cart.`);
    this.selectedQuantity = 1;
  }

  removeItem(index: number) {
    const item = this.newOrder.items[index];
    const productName = this.getProductName(item.productId);
    this.newOrder.items.splice(index, 1);
    this.toast.info('Item Removed', `${productName} removed from order draft.`);
  }

  getProductName(id: number): string {
    return this.products.find(p => p.id === id)?.name || 'Unknown Item';
  }

  getProductPrice(id: number): number {
    return this.products.find(p => p.id === id)?.price || 0;
  }

  getOrderTotalDraft(): number {
    return this.newOrder.items.reduce((total, item) => {
      return total + (this.getProductPrice(item.productId) * item.quantity);
    }, 0);
  }

  createOrder() {
    if (!this.newOrder.customerId) {
      this.toast.warning('Validation Error', 'Please select a customer.');
      return;
    }

    if (this.newOrder.items.length === 0) {
      this.toast.warning('Validation Error', 'Please add at least one item to the order.');
      return;
    }

    this.isSubmittingOrder = true;
    this.newOrder.customerId = Number(this.newOrder.customerId);
    
    this.toast.info('Submitting Transaction', 'Persisting order details...');

    this.orderService.createOrder(this.newOrder).subscribe({
      next: (res) => {
        this.isSubmittingOrder = false;
        this.toast.success('Order Completed', res.message || 'Transaction persisted successfully!');
        this.closeModal();
        this.loadOrders();
        // Refresh products to ensure stock amounts are up to date
        this.loadData();
      },
      error: (err) => {
        this.isSubmittingOrder = false;
        console.error('Order creation failed:', err);
        const errorMsg = err.error?.message || err.error?.title || 'Ensure stock levels and customer are valid.';
        this.toast.error('Order Submission Failed', errorMsg);
      }
    });
  }

  downloadInvoice(id: number) {
    if (this.downloadingInvoiceIds.has(id)) return;
    
    this.downloadingInvoiceIds.add(id);
    this.toast.info('Generating Invoice', `Preparing PDF receipt for transaction #${id}...`);

    this.actionService.downloadInvoice(id).subscribe({
      next: (blob) => {
        this.downloadingInvoiceIds.delete(id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_ShopUI_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Download Ready', `PDF Invoice #${id} saved successfully.`);
      },
      error: (err) => {
        this.downloadingInvoiceIds.delete(id);
        console.error(err);
        this.toast.error('Invoice Error', `Could not download receipt for transaction #${id}.`);
      }
    });
  }

  // Aggregate Calculations
  get totalRevenue(): number {
    return this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  get averageOrderValue(): number {
    return this.orders.length > 0 ? this.totalRevenue / this.orders.length : 0;
  }
}
