export interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryName: string;
    stock: number;
}

export interface CreateProductCommand {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    stock: number;
}

export interface PaginatedResult<T> {
  items: T[]; 
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
