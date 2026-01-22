
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X,
  LayoutDashboard,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { 
    theme, 
    toggleTheme, 
    itemCount, 
    user, 
    logout, 
    cart, 
    cartTotal, 
    removeFromCart, 
    updateCartQuantity,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useApp();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogoClick = () => {
    if (isAdmin) return;
    setSelectedCategory('Todos');
    setSearchQuery('');
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      const element = document.getElementById('products-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150); // Ligeiro delay para garantir renderização ou navegação
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    if (window.location.hash !== '') {
      onNavigate('home');
    }
    setIsMenuOpen(false);
    scrollToProducts();
  };

  const handleSearchToggle = () => {
    const nextSearchState = !isSearchOpen;
    setIsSearchOpen(nextSearchState);
    
    if (nextSearchState) {
      // Se estamos abrindo a busca, garantimos que estamos na home e rolamos para produtos
      if (window.location.hash !== '' && !window.location.hash.startsWith('#admin')) {
        onNavigate('home');
      }
      scrollToProducts();
    } else {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Se começar a digitar e não estiver na home (ou estiver no topo), rola para os produtos
    if (!isAdmin) {
      if (window.location.hash !== '' && !window.location.hash.startsWith('#admin')) {
        onNavigate('home');
      }
      scrollToProducts();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.hash = ''; 
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!user) {
      window.location.hash = 'auth';
    } else {
      window.location.hash = 'checkout';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-20">
      <div className={`${isAdmin ? 'w-full px-6' : 'max-w-7xl mx-auto px-4'} h-full flex items-center justify-between gap-4`}>
        {!isAdmin && (
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Logo e Busca */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1">
          <div 
            className={`text-2xl font-bold tracking-tighter flex items-center gap-2 ${isAdmin ? 'cursor-default' : 'cursor-pointer'} text-slate-900 dark:text-white shrink-0`}
            onClick={handleLogoClick}
          >
            LUMINA
            {isAdmin && (
              <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] px-2 py-0.5 rounded-md tracking-widest font-black flex items-center gap-1">
                <ShieldAlert size={10} /> PAINEL
              </span>
            )}
          </div>

          {/* Barra de Busca Expansível (Desktop) */}
          {!isAdmin && !isMenuOpen && (
            <div className={`hidden md:flex items-center relative transition-all duration-300 ${isSearchOpen ? 'w-full max-w-[240px] lg:max-w-[320px]' : 'w-10 overflow-hidden'}`}>
              <button 
                onClick={handleSearchToggle}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 z-10"
              >
                {isSearchOpen ? <X size={18} className="text-slate-400" /> : <Search size={20} />}
              </button>
              <input 
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar..."
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-full pl-12 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              />
            </div>
          )}
        </div>

        {/* Navegação de Categorias (Sempre visível no desktop) */}
        {!isAdmin && (
          <nav className="hidden lg:flex items-center space-x-8 px-2 overflow-x-auto no-scrollbar">
            {/* Fix: Compare Category.name with string and filter for main categories only */}
            {categories.filter(c => c.name !== 'Todos' && !c.parentId).map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.name)}
                className={`text-lg font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.name && !searchQuery
                  ? 'text-primary-600 underline underline-offset-8 decoration-2' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        )}

        {/* Ícones de Ação */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {!isAdmin && (
            <button 
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              onClick={handleSearchToggle}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          )}
          
          <button 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="relative group">
            <button 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center space-x-2"
              onClick={() => user ? null : onNavigate('auth')}
            >
              <User size={20} />
              {user && <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">{user.name}</span>}
            </button>
            
            {user && (
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 w-48 overflow-hidden">
                  {isAdmin && (
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestor Logado</p>
                    </div>
                  )}
                  {isAdmin && (
                    <button 
                      onClick={() => onNavigate('admin')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 font-bold text-primary-600"
                    >
                      <LayoutDashboard size={14} />
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold"
                  >
                    Encerrar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isAdmin && (
            <div className="relative" ref={cartRef}>
              <button 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {isCartOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[70]">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold">Sua Sacola ({itemCount})</h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-20 object-cover rounded-lg bg-slate-100 dark:bg-slate-900"
                          />
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-slate-500">R$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-lg px-2 py-1">
                                <button 
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="text-slate-500 hover:text-primary-600"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="text-slate-500 hover:text-primary-600"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">Sua sacola está vazia</p>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                      {!user && (
                        <p className="text-[10px] text-center text-slate-400 mb-3 font-bold uppercase flex items-center justify-center gap-1">
                          <Lock size={10} /> Login obrigatório para comprar
                        </p>
                      )}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="text-lg font-black">R$ {cartTotal.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={handleCheckoutClick}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-primary-500/20"
                      >
                        {user ? 'Finalizar Compra' : 'Entrar para Comprar'}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Busca Overlay (Mobile) */}
      {!isAdmin && isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-top duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="O que você está procurando?"
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white dark:bg-slate-900 p-6 animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black">LUMINA</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          </div>
          <nav className="flex flex-col gap-6">
            <button 
              onClick={() => handleCategoryClick('Todos')}
              className={`text-2xl font-black text-left ${selectedCategory === 'Todos' && !searchQuery ? 'text-primary-600' : ''}`}
            >
              Início
            </button>
            {/* Fix: Compare Category.name with string and filter for main categories only */}
            {categories.filter(c => c.name !== 'Todos' && !c.parentId).map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.name)}
                className={`text-2xl font-black text-left ${selectedCategory === cat.name && !searchQuery ? 'text-primary-600' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
