
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
      
      // Se não houver hash ou for home, garante que a página atual seja 'home'
      if (!hash || hash === '' || hash === '#' || hash === '#home') {
        setCurrentPage('home');
        setSelectedProductId(null);
        return;
      }

      // Se o usuário já estiver autenticado como admin
      if (user?.role === 'admin') {
        if (hash === '#admin') {
          setCurrentPage('admin');
        } else {
          window.location.hash = '#admin';
          setCurrentPage('admin');
        }
        return;
      }

      // Lógica de rotas protegidas e públicas
      if (hash === '#auth') {
        if (user) {
          // Usuário já logado tentando acessar auth volta para home ou checkout
          window.location.hash = cart.length > 0 ? '#checkout' : '';
        } else {
          setCurrentPage('auth');
        }
      } 
      else if (hash === '#admin') {
        if (!user) {
          setCurrentPage('auth');
          window.location.hash = '#auth';
        } else {
          setCurrentPage('home');
          window.location.hash = '';
        }
      }
      else if (hash === '#checkout') {
        if (!user) {
          setCurrentPage('auth');
          window.location.hash = '#auth';
        } else {
          setCurrentPage('checkout');
        }
      }
      else if (hash === '#order-success') {
        setCurrentPage('order-success');
      }
      else if (hash.startsWith('#product/')) {
        const id = hash.split('/')[1];
        setSelectedProductId(id);
        setCurrentPage('product-detail');
      }
      else {
        setCurrentPage('home');
        setSelectedProductId(null);
        window.location.hash = '';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, cart.length]);

  const renderContent = () => {
    switch (currentPage) {
      case 'auth':
        return <Auth onAuthSuccess={(role) => {
          if (role === 'admin') {
            window.location.hash = 'admin';
          } else {
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
