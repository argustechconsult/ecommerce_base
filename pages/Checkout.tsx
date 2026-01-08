
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowLeft, CreditCard, Lock, Mail, Globe, CheckCircle2, Truck, Loader2 } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, cartTotal } = useApp() as any;
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para o Frete
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('standard');

  const calculateShipping = async (zipCode: string) => {
    if (zipCode.replace(/\D/g, '').length === 8) {
      setIsCalculatingShipping(true);
      // Simulação de chamada de API de frete (Ex: Melhor Envio ou Correios)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Lógica fictícia: CEPs começando com '0' são mais baratos (SP)
      const isNear = zipCode.startsWith('0');
      const baseCost = isNear ? 15.90 : 29.90;
      setShippingCost(baseCost);
      setIsCalculatingShipping(false);
    } else {
      setShippingCost(null);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    // Máscara 00000-000
    const maskedValue = value.length > 5 
      ? `${value.slice(0, 5)}-${value.slice(5)}` 
      : value;
    
    setCep(maskedValue);
    if (value.length === 8) {
      calculateShipping(value);
    } else {
      setShippingCost(null);
    }
  };

  const finalTotal = cartTotal + (shippingCost || 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCalculatingShipping) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      window.location.hash = 'order-success';
    }, 2500);
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-[80vh] flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
      {/* Resumo Lateral */}
      <div className="lg:w-5/12 bg-slate-50 dark:bg-slate-800/50 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => window.location.hash = ''}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-12 text-sm font-bold"
        >
          <ArrowLeft size={16} /> Voltar para a Loja
        </button>

        <div className="mb-8">
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Pagando Lumina Fashion</p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">R$ {finalTotal.toFixed(2)}</h2>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[40vh] lg:max-h-none pr-2">
          {cart.map((item: any) => (
            <div key={item.id} className="flex gap-4 animate-in slide-in-from-left duration-300">
              <div className="relative">
                <img src={item.image} className="w-16 h-20 rounded-xl object-cover shadow-sm" alt={item.name} />
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.category}</p>
              </div>
              <div className="flex items-center font-bold text-sm dark:text-slate-200">
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 items-center">
            <span>Frete</span>
            {isCalculatingShipping ? (
              <span className="flex items-center gap-2 text-primary-600 text-xs font-bold animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Calculando...
              </span>
            ) : shippingCost !== null ? (
              <span className="font-bold text-slate-900 dark:text-white">R$ {shippingCost.toFixed(2)}</span>
            ) : (
              <span className="text-slate-400 italic text-xs">Informe o CEP</span>
            )}
          </div>
          <div className="flex justify-between items-center text-lg font-black pt-4 dark:text-white">
            <span>Total a Pagar</span>
            <span>R$ {finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Formulário de Pagamento */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900">
        <form onSubmit={handlePay} className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-10">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <CreditCard size={20} />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Pagamento Seguro</h3>
          </div>

          <div className="space-y-6">
            <div className="animate-in fade-in duration-500 delay-100">
              <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Endereço de e-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="animate-in fade-in duration-500 delay-200">
              <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Informações do cartão</label>
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="relative border-b border-slate-100 dark:border-slate-700">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="1234 5678 1234 5678"
                    className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:ring-0 dark:text-white"
                    required
                  />
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="MM / AA"
                    className="w-1/2 px-4 py-3.5 bg-transparent border-r border-slate-100 dark:border-slate-700 focus:ring-0 border-none dark:text-white"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="CVC"
                    className="w-1/2 px-4 py-3.5 bg-transparent border-none focus:ring-0 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500 delay-300">
              <div>
                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">País</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <select className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm appearance-none focus:outline-none dark:text-white">
                    <option>Brasil</option>
                    <option>Estados Unidos</option>
                    <option>Portugal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">CEP</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 rounded-xl text-sm focus:outline-none dark:text-white transition-colors ${
                      isCalculatingShipping ? 'border-primary-400' : 'border-slate-100 dark:border-slate-700'
                    }`}
                    required
                  />
                  {isCalculatingShipping && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 animate-spin" size={16} />
                  )}
                </div>
              </div>
            </div>

            {shippingCost !== null && (
              <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/50 flex items-center gap-4 animate-in slide-in-from-top-4">
                <div className="p-2 bg-primary-600 rounded-lg text-white">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-primary-900 dark:text-primary-100">Entrega Estimada</p>
                  <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">Em até 5 dias úteis para {cep}</p>
                </div>
              </div>
            )}

            <div className="pt-4 animate-in fade-in duration-500 delay-400">
              <button 
                type="submit"
                disabled={isProcessing || isCalculatingShipping || shippingCost === null}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>{shippingCost === null ? 'Informe o CEP' : `Pagar R$ ${finalTotal.toFixed(2)}`}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-4">
              <ShieldCheck size={14} />
              Criptografia de 256 bits via Stripe
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
