import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { CustomerDTO, CreateCustomerCommand, UpdateCustomerCommand } from '../../models/customer.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  customers: CustomerDTO[] = [];
  
  // Search state
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // Add/Edit Modal state
  isModalOpen = false;
  isEditMode = false;
  newCustomer: any = { id: 0, name: '', email: '', phone: '' };

  // Delete confirmation Modal state
  isDeleteModalOpen = false;
  customerToDelete: CustomerDTO | null = null;

  // Loading states
  isLoadingCustomers = false;
  isSavingCustomer = false;
  isActionInProgress = false;

  constructor(
    private customerService: CustomerService,
    private toast: ToastService
  ) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.executeSearch();
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoadingCustomers = true;
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res.items || res || [];
        this.isLoadingCustomers = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.toast.error('Query Failed', 'Could not query customer accounts.');
        this.isLoadingCustomers = false;
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  executeSearch() {
    const term = this.searchTerm.trim();
    if (term) {
      this.isLoadingCustomers = true;
      const isId = /^[0-9]+$/.test(term);
      const idParam = isId ? Number(term) : undefined;
      const nameParam = !isId ? term : undefined;
      
      this.customerService.searchCustomer(idParam, nameParam).subscribe({
        next: (res: any) => {
          const result = res?.items || res;
          this.customers = Array.isArray(result) ? result : (result ? [result] : []);
          this.isLoadingCustomers = false;
        },
        error: (err) => {
          console.error(err);
          this.customers = [];
          this.isLoadingCustomers = false;
        }
      });
    } else {
      this.loadCustomers();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.newCustomer = { id: 0, name: '', email: '', phone: '' };
    this.isModalOpen = true;
  }

  openEditModal(customer: CustomerDTO) {
    this.isEditMode = true;
    // Map the CustomerDTO properties back to the internal form model
    this.newCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newCustomer = { id: 0, name: '', email: '', phone: '' };
  }

  saveCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.phone) {
      this.toast.warning('Validation Error', 'Full Name and Phone Number are required.');
      return;
    }

    this.isSavingCustomer = true;
    this.toast.info('Saving Account', 'Submitting account profile parameters...');

    if (this.isEditMode) {
      const cmd: UpdateCustomerCommand = {
        id: this.newCustomer.id,
        fullName: this.newCustomer.name,
        email: this.newCustomer.email || '',
        phoneNumber: this.newCustomer.phone
      };

      this.customerService.updateCustomer(cmd.id, cmd).subscribe({
        next: () => {
          this.isSavingCustomer = false;
          this.toast.success('Account Updated', `Successfully updated profile for ${cmd.fullName}.`);
          this.closeModal();
          this.loadCustomers();
        },
        error: (err) => {
          this.isSavingCustomer = false;
          console.error(err);
          const errorMsg = err.error?.message || err.error?.title || 'Check parameters.';
          this.toast.error('Update Failed', errorMsg);
        }
      });
    } else {
      const cmd: CreateCustomerCommand = {
        fullName: this.newCustomer.name,
        email: this.newCustomer.email || '',
        phoneNumber: this.newCustomer.phone
      };

      this.customerService.createCustomer(cmd).subscribe({
        next: () => {
          this.isSavingCustomer = false;
          this.toast.success('Account Created', `Billing profile configured for ${cmd.fullName}.`);
          this.closeModal();
          this.loadCustomers();
        },
        error: (err) => {
          this.isSavingCustomer = false;
          console.error(err);
          const errorMsg = err.error?.message || err.error?.title || 'Ensure phone or email are unique.';
          this.toast.error('Registration Failed', errorMsg);
        }
      });
    }
  }

  // Soft Delete Modal trigger
  triggerDelete(customer: CustomerDTO) {
    this.customerToDelete = customer;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.customerToDelete = null;
  }

  confirmDelete() {
    if (!this.customerToDelete || this.isActionInProgress) return;

    this.isActionInProgress = true;
    const target = this.customerToDelete;
    
    this.toast.info('Deleting Account', `Suspending user profile #${target.id}...`);

    this.customerService.deleteCustomer(target.id).subscribe({
      next: () => {
        this.isActionInProgress = false;
        this.toast.success('Account Suspended', `Billing record for ${target.name} has been soft-deleted.`);
        this.closeDeleteModal();
        this.loadCustomers();
      },
      error: (err) => {
        this.isActionInProgress = false;
        console.error(err);
        this.toast.error('Suspension Failed', 'Could not soft-delete account.');
        this.closeDeleteModal();
      }
    });
  }

  onRestore(customer: CustomerDTO) {
    if (this.isActionInProgress) return;

    this.isActionInProgress = true;
    this.toast.info('Restoring Account', `Re-activating client profile #${customer.id}...`);

    this.customerService.restoreCustomer(customer.id).subscribe({
      next: () => {
        this.isActionInProgress = false;
        this.toast.success('Account Restored', `Billing profile for ${customer.name} is now active.`);
        this.loadCustomers();
      },
      error: (err) => {
        this.isActionInProgress = false;
        console.error(err);
        this.toast.error('Restore Failed', 'Could not reactivate client account.');
      }
    });
  }
}
