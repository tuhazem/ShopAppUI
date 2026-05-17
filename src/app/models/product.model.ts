export interface ProductModel{
    id:number;
    name:string;
    description:string;
    price:number;
    categoryName:string;

}

export interface CreateProductModel{

    name:string;
    description:string;
    price:number;
    categoryId:number;
    stock:number;

}

export interface PaginatedResult<T> {
    items: ProductModel[]; 
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}