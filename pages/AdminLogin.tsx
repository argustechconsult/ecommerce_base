
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User as UserIcon, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onAuthSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthSuccess }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    // Simulação de verificação
    setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
            login('admin@lumina.com');
            onAuthSuccess();
          } else {
            setError('Acesso não autorizado. Verifique as credenciais profissionais.');
            setIsLoggingIn(false);
          }
    }, 800);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary-600 rounded-3xl shadow-lg shadow-primary-500/40 text-white">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black tracking-tight mb-2">Acesso Profissional</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Área administrativa restrita. Apenas pessoal autorizado.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Chave de Segurança</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 text-red-500 text-xs font-bold rounded-2xl border border-red-500/20 animate-in shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all transform active:scale-95 disabled:opacity-50 shadow-xl shadow-primary-500/20"
            >
              {isLoggingIn ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Autenticar Acesso
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => window.location.hash = ''}
              className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors"
            >
              Voltar para Loja Pública
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest opacity-60">
            <Lock size={12} />
            Sessão Criptografada de Ponta a Ponta
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
