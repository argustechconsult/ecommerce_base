
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; // Changed from enum to string for dynamic creation
  image: string;
  secondaryImages: string[];
  stock: number;
  rating: number;
  sizes?: string[];
  colors?: { name: string, hex: string }[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
}
