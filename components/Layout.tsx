
import React from 'react';
import Header from './Header';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const { theme } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header onNavigate={onNavigate} />
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LUMINA</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Vestuário premium para o estilo de vida moderno. Materiais de qualidade, fabricação ética.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-xs tracking-widest text-slate-400">Loja</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="cursor-pointer hover:text-primary-600">Novidades</li>
              <li className="cursor-pointer hover:text-primary-600">Mais Vendidos</li>
              <li className="cursor-pointer hover:text-primary-600">Coleção de Verão</li>
              <li className="cursor-pointer hover:text-primary-600">Promoções</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-xs tracking-widest text-slate-400">Empresa</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="cursor-pointer hover:text-primary-600">Sobre Nós</li>
              <li className="cursor-pointer hover:text-primary-600">Sustentabilidade</li>
              <li className="cursor-pointer hover:text-primary-600">Carreiras</li>
              <li className="cursor-pointer hover:text-primary-600" onClick={() => window.location.hash = 'admin-login'}>
                <div className="flex items-center gap-1.5 text-primary-600 font-bold">
                    <ShieldAlert size={14} /> Acesso Profissional
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-xs tracking-widest text-slate-400">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Endereço de e-mail"
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Entrar
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 text-xs">
          © 2024 Lumina Fashion. Todos os direitos reservados. Construído com Gemini AI.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
