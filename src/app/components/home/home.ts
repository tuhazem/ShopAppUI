import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CreateProductModel, ProductModel } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  imports: [CommonModule ,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {

  categories: any[] = [];
  newproduct: any = {
    id:0,
    name: '',
    price: 0,
    description: '',
    categoryId: 0 ,
    stock:0
  };

  
  products: ProductModel[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;

    isEditMode:boolean = false

  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  totalPages: number = 0;

  changePage(newPage: number) {
    if(newPage >= 1 && newPage <= this.totalPages) {
      this.pageNumber = newPage;
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (result) => {
        console.log("Products loaded: ", result);
        this.products = result.items;
        this.totalPages = result.totalPages;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (result) => {
        console.log("Categories loaded: ", result);
        this.categories = result;
      }
    });
  }

  prepareAdd() {
    this.isEditMode = false; 
    this.newproduct = {id:0 , name: '', price: 0, description: '', categoryId: 0 , stock:0}; // Reset form
  }

  saveProduct() {
    console.log("Current Mode:", this.isEditMode);
    console.log("Product to Save:", this.newproduct);
    if(this.isEditMode){
    this.productService.UpdateProduct(this.newproduct.id , this.newproduct).subscribe({
      next :()=>{
        alert("Upate Done")
        this.loadProducts()
        this.newproduct = {id:0 , name: '', price: 0, description: '', categoryId: 0 , stock:0 }; // Reset form

      }
    });
    }else {
    this.productService.AddProduct(this.newproduct).subscribe({

      next: (response) => {
        alert("Product added successfully!");
        this.loadProducts(); // Refresh the product list after adding
        this.newproduct = {id:0 , name: '', price: 0, description: '', categoryId: 0 , stock:0 }; // Reset form
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert("Failed to add product: " + error.error.message);
      }

    });
  }}

openModal() {
  const element = document.getElementById('addModal');
  if (element) {
    const myModal = new bootstrap.Modal(element);
    myModal.show();
  }
}

  onDelete(id: number){
    if(confirm("Are You Sure To Delete This Item ?")){
      this.productService.DeleteProduct(id).subscribe({
        next: ()=>{
          alert("Deleted Succ");
          this.loadProducts()
        },
        error:(error)=>{
          console.error(error)
          alert("Cant Delete This Product");
        }
      })
    }
  }

  onEdit(item:any){
    this.isEditMode = true;
    this.newproduct = {...item}
  }




}