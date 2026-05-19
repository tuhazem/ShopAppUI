export interface OrderItemDTO {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderDto {
    id: number;
    orderDate: string;
    totalAmount: number;
    customerName: string;
    items: OrderItemDTO[];
}

export interface CreateOrderCommand {
    customerId: number;
    items: { productId: number; quantity: number }[];
}
