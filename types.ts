
export interface Category {
  id: string;
  name: string;
  parentId?: string; // Se presente, identifica que é uma subcategoria
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  subCategory?: string; // Nova propriedade para subcategorias
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
