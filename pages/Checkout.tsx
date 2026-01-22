
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Truck, 
  Loader2, 
  Plus, 
  Minus, 
  Trash2,
  ShoppingBag,
  MapPin,
  ChevronRight
} from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart } = useApp();
  const [step, setStep] = useState<'review' | 'payment'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para o Frete
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const calculateShipping = async (zipCode: string) => {
    if (zipCode.replace(/\D/g, '').length === 8) {
      setIsCalculatingShipping(true);
      // Simulação de chamada de API de frete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    const maskedValue = value.length > 5 ? `${value.slice(0, 5)}-${value.slice(5)}` : value;
    setCep(maskedValue);
    if (value.length === 8) calculateShipping(value);
    else setShippingCost(null);
  };

  const finalTotal = cartTotal + (shippingCost || 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      window.location.hash = 'order-success';
    }, 2000);
  };

  if (cart.length === 0 && step === 'review') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black mb-2">Sua sacola está vazia</h2>
        <p className="text-slate-500 mb-8">Adicione alguns itens para continuar o checkout.</p>
        <button 
          onClick={() => window.location.hash = ''}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl"
        >
          Voltar para a Loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-12 gap-4">
        <div className={`flex items-center gap-2 ${step === 'review' ? 'text-primary-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step === 'review' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800'}`}>1</div>
          <span className="text-sm font-black uppercase tracking-widest hidden sm:inline">Revisão</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step === 'payment' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800'}`}>2</div>
          <span className="text-sm font-black uppercase tracking-widest hidden sm:inline">Pagamento</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Lado Esquerdo: Conteúdo Principal (Review ou Form) */}
        <div className="flex-1 w-full space-y-6">
          {step === 'review' ? (
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-left duration-500">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                <ShoppingBag size={24} className="text-primary-600" />
                Itens na Sacola
              </h3>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all">
                    <img src={item.image} className="w-full sm:w-24 h-32 object-cover rounded-2xl shadow-sm" alt={item.name} />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-black text-lg text-slate-900 dark:text-white">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${item.quantity === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-primary-600'}`}>
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Section embutida no Review */}
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Truck size={22} className="text-primary-600" />
                  Opções de Entrega
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Calcular Frete (CEP)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-sm font-bold"
                      />
                      {isCalculatingShipping && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 size={18} className="animate-spin text-primary-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {shippingCost !== null && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-5 flex items-center gap-4 animate-in zoom-in duration-300">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-emerald-600 tracking-tighter">Frete Calculado</p>
                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">R$ {shippingCost.toFixed(2)} — 5 dias úteis</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-600 p-2.5 rounded-xl text-white shadow-lg">
                    <CreditCard size={24} />
                  </div>
                  <h3 className="text-2xl font-black">Pagamento Seguro</h3>
                </div>
                <button onClick={() => setStep('review')} className="text-xs font-bold text-slate-400 hover:text-primary-600 flex items-center gap-1">
                  <ArrowLeft size={14} /> Editar Pedido
                </button>
              </div>

              <form onSubmit={handlePay} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">E-mail para Recibo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="email" required placeholder="seu@email.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-sm font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Dados do Cartão</label>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div className="relative border-b border-slate-100 dark:border-slate-800">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="Número do Cartão" className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm font-bold" required />
                      </div>
                      <div className="flex divide-x divide-slate-100 dark:divide-slate-800">
                        <input type="text" placeholder="Validade MM/AA" className="w-1/2 px-6 py-4 bg-transparent border-none focus:ring-0 text-sm font-bold" required />
                        <input type="text" placeholder="CVC" className="w-1/2 px-6 py-4 bg-transparent border-none focus:ring-0 text-sm font-bold" required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">País / Região</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <select className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-sm font-bold appearance-none">
                        <option>Brasil</option>
                        <option>Portugal</option>
                        <option>Estados Unidos</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        <span>Pagar Agora R$ {finalTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    <ShieldCheck size={14} /> Processamento Stripe 256-bit SSL
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Lado Direito: Resumo do Pedido (Sticky) */}
        <div className="w-full lg:w-96 lg:sticky lg:top-28">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Efeito Visual de Fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px] rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/10 blur-[40px] rounded-full -ml-12 -mb-12" />

            <h3 className="text-lg font-black mb-8 relative z-10">Resumo da Compra</h3>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between text-sm text-slate-400 font-bold">
                <span>Subtotal</span>
                <span className="text-white">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400 font-bold">
                <span>Frete</span>
                {shippingCost !== null ? (
                  <span className="text-white">R$ {shippingCost.toFixed(2)}</span>
                ) : (
                  <span className="text-primary-400 italic">Pendente</span>
                )}
              </div>
              {shippingCost !== null && (
                <div className="flex justify-between text-xs text-emerald-400 font-black uppercase tracking-widest pt-1">
                  <span>Desconto Aplicado</span>
                  <span>- R$ 0,00</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10 mb-8 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Final</span>
                <span className="text-3xl font-black">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'review' ? (
              <button 
                onClick={() => setStep('payment')}
                disabled={shippingCost === null || isCalculatingShipping || cartTotal === 0}
                className="w-full bg-white text-slate-900 py-4.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 shadow-xl group"
              >
                {cartTotal === 0 ? 'Adicione itens' : 'Confirmar Compra'}
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1">Status do Pedido</p>
                <p className="text-xs font-bold text-white">Aguardando Pagamento</p>
              </div>
            )}
            
            <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest relative z-10">
              <Lock size={12} /> Pagamento 100% Criptografado
            </div>
          </div>

          <button 
            onClick={() => window.location.hash = ''}
            className="w-full mt-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
