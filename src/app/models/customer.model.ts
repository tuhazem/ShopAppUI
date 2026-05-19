export interface CustomerDTO {
    id: number;
    name: string;
    phone: string;
    email: string;
    balance: number;
    isDeleted?: boolean;
}

export interface CreateCustomerCommand {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface UpdateCustomerCommand {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}
