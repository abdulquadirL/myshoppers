export type UserRole = 'customer' | 'shopper' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  role: 'customer';
  savedMarkets?: string[];
  orderHistory?: string[];
}

export interface PersonalShopper extends User {
  role: 'shopper';
  rating: number;
  availableForOrders: boolean;
  activeOrderId?: string;
  completedOrders: number;
  servingMarkets: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Market {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  image: string;
  categories: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  marketId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  unit: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  shopperId?: string;
  marketId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  serviceFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  shopperId: string;
  image: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'shopping' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 'card' | 'cash' | 'transfer';

export type PaymentStatus = 'pending' | 'paid' | 'failed';