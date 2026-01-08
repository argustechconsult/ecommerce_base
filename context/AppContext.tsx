
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, User, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

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
  // Categorias e Busca
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['Todos', 'Masculino', 'Feminino', 'Acessórios', 'Promoção']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email: string) => {
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'admin' : 'customer'
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setSelectedCategory('Todos');
    setSearchQuery('');
  };

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const addCategory = (name: string) => {
    if (!name || name.trim() === '') return;
    if (!categories.includes(name.trim())) {
      setCategories(prev => [...prev, name.trim()]);
    }
  };

  const updateCategory = (oldName: string, newName: string) => {
    if (!newName || newName.trim() === '' || oldName === 'Todos') return;
    const trimmedNew = newName.trim();
    setCategories(prev => prev.map(c => c === oldName ? trimmedNew : c));
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: trimmedNew } : p));
    if (selectedCategory === oldName) setSelectedCategory(trimmedNew);
  };

  const deleteCategory = (name: string) => {
    if (name === 'Todos') return;
    if (confirm(`Excluir a categoria "${name}"? Os produtos vinculados a ela permanecerão mas sem categoria específica.`)) {
      setCategories(prev => prev.filter(c => c !== name));
      setProducts(prev => prev.map(p => p.category === name ? { ...p, category: 'Sem Categoria' } : p));
      if (selectedCategory === name) setSelectedCategory('Todos');
    }
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      user, login, logout, cartTotal, itemCount,
      products, addProduct, updateProduct, deleteProduct,
      categories, selectedCategory, setSelectedCategory,
      searchQuery, setSearchQuery,
      addCategory, updateCategory, deleteCategory
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
