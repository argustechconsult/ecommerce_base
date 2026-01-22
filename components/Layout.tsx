
import React from 'react';
import Header from './Header';
import { useApp } from '../context/AppContext';
import { Instagram, CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const { theme, notifications, removeNotification, user } = useApp();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <Header onNavigate={onNavigate} />
      
      {/* Container de Notificações (Toasts) */}
      <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm sm:max-w-md items-end px-4">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-800/90 border-slate-700' 
                : 'bg-white/90 border-slate-100'
            }`}
          >
            <div className={`shrink-0 p-2 rounded-xl ${
              n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
              n.type === 'error' ? 'bg-red-100 text-red-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {n.type === 'success' && <CheckCircle2 size={20} />}
              {n.type === 'error' && <AlertCircle size={20} />}
              {n.type === 'info' && <Info size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">LUMINA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{n.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <main className={`pt-20 ${isAdmin ? 'w-full' : 'pb-12 px-4 max-w-7xl mx-auto'}`}>
        {children}
      </main>
      
      {!isAdmin && (
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-black tracking-tighter">LUMINA</h3>
              <div className="w-6 h-1 bg-primary-600 rounded-full"></div>
            </div>
            
            <div className="flex items-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-110 active:scale-95"
                aria-label="Instagram"
              >
                <Instagram size={20} />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] text-center">
              © 2024 Lumina Fashion. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
