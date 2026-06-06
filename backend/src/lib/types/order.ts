

export interface OrderClient {
    isOrderValid: boolean;
    customerName: string;
    phone: string;
    address: string;
    totalPrice: number;
    items: {
        id: string;
        price: number;
        quantity: number;
    }[];
}