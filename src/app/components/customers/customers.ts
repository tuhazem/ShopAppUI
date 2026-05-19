import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CustomerDTO, CreateCustomerCommand, UpdateCustomerCommand } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  customers: CustomerDTO[] = [];
  searchTerm = '';
  isEditMode = false;
  newCustomer: any = { id: 0, name: '', email: '', phone: '' };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(res => {
      this.customers = res.items || res;
    });
  }

  onSearch() {
    const term = this.searchTerm.trim();
    if (term) {
      const isId = /^[0-9]+$/.test(term);
      const idParam = isId ? Number(term) : undefined;
      const nameParam = !isId ? term : undefined;
      
      this.customerService.searchCustomer(idParam, nameParam).subscribe({
        next: (res: any) => {
          const result = res?.items || res;
          this.customers = Array.isArray(result) ? result : (result ? [result] : []);
        },
        error: () => this.customers = []
      });
    } else {
      this.loadCustomers();
    }
  }

  prepareAdd() {
    this.isEditMode = false;
    this.newCustomer = { id: 0, name: '', email: '', phone: '' };
  }

  onEdit(customer: CustomerDTO) {
    this.isEditMode = true;
    this.newCustomer = { ...customer };
  }

  saveCustomer() {
    if (this.isEditMode) {
      const cmd: UpdateCustomerCommand = {
        id: this.newCustomer.id,
        fullName: this.newCustomer.name, // Assuming API command still uses fullName
        email: this.newCustomer.email,
        phoneNumber: this.newCustomer.phone // Assuming API command still uses phoneNumber
      };
      this.customerService.updateCustomer(cmd.id, cmd).subscribe(() => {
        alert('Customer updated');
        this.loadCustomers();
      });
    } else {
      const cmd: CreateCustomerCommand = {
        fullName: this.newCustomer.name,
        email: this.newCustomer.email,
        phoneNumber: this.newCustomer.phone
      };
      this.customerService.createCustomer(cmd).subscribe(() => {
        alert('Customer created');
        this.loadCustomers();
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Soft delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
    }
  }

  onRestore(id: number) {
    this.customerService.restoreCustomer(id).subscribe(() => this.loadCustomers());
  }
}
