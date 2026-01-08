
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

const AppContent: React.FC = () => {
  const { user, cart } = useApp();
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'admin' | 'product-detail' | 'checkout' | 'order-success'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Regras de Redirecionamento Admin
      if (user?.role === 'admin') {
        if (hash !== '#admin' && !hash.startsWith('#admin-login')) {
          window.location.hash = '#admin';
          return;
        }
        setCurrentPage('admin');
        return;
      }

      // Proteção de Rotas para Clientes
      if (hash === '#auth') {
        setCurrentPage('auth');
      } else if (hash === '#admin') {
        if (!user) setCurrentPage('auth');
        else if (user.role !== 'admin') {
          window.location.hash = '';
          setCurrentPage('home');
        } else {
          setCurrentPage('admin');
        }
      }
      else if (hash === '#checkout') {
        // OBRIGATORIEDADE DE LOGIN PARA CHECKOUT
        if (!user) {
          window.location.hash = '#auth';
          setCurrentPage('auth');
        } else {
          setCurrentPage('checkout');
        }
      }
      else if (hash === '#order-success') {
        setCurrentPage('order-success');
      }
      else if (hash.startsWith('#product/')) {
        setSelectedProductId(hash.split('/')[1]);
        setCurrentPage('product-detail');
      }
      else {
        setCurrentPage('home');
        setSelectedProductId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const renderContent = () => {
    switch (currentPage) {
      case 'auth':
        return <Auth onAuthSuccess={(role) => {
          if (role === 'admin') {
            window.location.hash = 'admin';
          } else {
            // Se houver produtos no carrinho, vai para o checkout, senão vai para a home
            if (cart.length > 0) {
              window.location.hash = 'checkout';
            } else {
              window.location.hash = '';
            }
          }
        }} />;
      case 'admin':
        return <AdminDashboard />;
      case 'checkout':
        return <Checkout />;
      case 'order-success':
        return <OrderSuccess />;
      case 'product-detail':
        return <ProductDetail productId={selectedProductId || ''} />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <Layout onNavigate={(page) => {
      if (user?.role === 'admin' && page !== 'admin') return;
      window.location.hash = page === 'home' ? '' : page;
    }}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
