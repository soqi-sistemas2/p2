
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  available: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  observations?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  observations?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'pix';

export interface StoreSettings {
  id?: string;
  name: string;
  logo?: string;
  openingHours: {
    open: string;
    close: string;
    days: number[];
  };
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  paymentMethods: PaymentMethod[];
  notificationEmail?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
