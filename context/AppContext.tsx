
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, User, Product, Category, Order } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Carrinho
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  // Usuário
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  // Produtos
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Pedidos
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  // Categorias e Busca
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (sub: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addCategory: (name: string, parentId?: string) => void;
  updateCategory: (id: string, newName: string, parentId?: string) => void;
  deleteCategory: (id: string) => void;
  // Notificações
  notifications: Notification[];
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS_CART_KEY = 'lumina_cart';
const LS_USER_KEY = 'lumina_user';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LS_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LS_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-todos', name: 'Todos' },
    { id: 'cat-masc', name: 'Masculino' },
    { id: 'cat-fem', name: 'Feminino' },
    { id: 'cat-acess', name: 'Acessórios' },
    { id: 'cat-prom', name: 'Promoção' },
    { id: 'sub-camisas', name: 'Camisas', parentId: 'cat-masc' },
    { id: 'sub-vestidos', name: 'Vestidos', parentId: 'cat-fem' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_USER_KEY);
    }
  }, [user]);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { message, type, id }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    notify(`${product.name} adicionado à sua sacola!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(LS_CART_KEY);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email: string) => {
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role: email.includes('admin') ? 'admin' : 'customer'
    };
    setUser(mockUser);
    notify(`Bem-vindo, ${mockUser.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    setSelectedCategory('Todos');
    setSelectedSubCategory('Todas');
    setSearchQuery('');
    notify('Você saiu da sua conta.', 'info');
  };

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    const statusLabels: Record<string, string> = {
      'Shipped': 'Enviado',
      'Delivered': 'Entregue',
      'Cancelled': 'Cancelado',
      'Pending': 'Pendente'
    };
    notify(`Pedido ${orderId} atualizado para: ${statusLabels[newStatus]}`, 'info');
  };

  const addCategory = (name: string, parentId?: string) => {
    if (!name || name.trim() === '') return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      parentId
    };
    setCategories(prev => [...prev, newCat]);
    notify(`Categoria "${name}" criada com sucesso!`);
  };

  const updateCategory = (id: string, newName: string, parentId?: string) => {
    if (!newName || newName.trim() === '') return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName.trim(), parentId } : c));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category || id === 'cat-todos') return;
    
    if (confirm(`Excluir a categoria "${category.name}"? As subcategorias e produtos vinculados podem ser afetados.`)) {
      setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
      setProducts(prev => prev.map(p => {
        if (p.category === category.name) return { ...p, category: 'Sem Categoria', subCategory: undefined };
        return p;
      }));
      if (selectedCategory === category.name) setSelectedCategory('Todos');
    }
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      user, login, logout, cartTotal, itemCount,
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus,
      categories, selectedCategory, setSelectedCategory,
      selectedSubCategory, setSelectedSubCategory,
      searchQuery, setSearchQuery,
      addCategory, updateCategory, deleteCategory,
      notifications, notify, removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
