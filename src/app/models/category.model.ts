export interface CategoryDTO {
    id: number;
    name: string;
    products?: {
        id: number;
        name: string;
        price: number;
        stock: number;
    }[];
}

export interface CreateCategoryCommand {
    name: string;
}

export interface UpdateCategoryCommand {
    id: number;
    name: string;
}
