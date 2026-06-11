
export type OrderType = "pending" | "process" | "on_delivery" | "completed";
export interface OrderItem {
  id: string;
  price: number;
  nameProduct: string;
  imageUrl: string;
  quantity: number;
}

export interface OrderDetails {
  isOrderValid: boolean;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: OrderItem[];
}

export interface Order {
  id: string;
  totalPrice: number;
  status: OrderType;
  createdAt: string;
  updatedAt: string;
  details?: OrderDetails | null;
}

export interface OrderStats {
  total: number;
  totalPending: number;
  totalProcess: number;
  totalCompleted: number;
}