
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  Package, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  Mail, 
  Star, 
  Printer, 
  X, 
  FileText,
  Download,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const { cart, cartTotal, setSelectedCategory, clearCart } = useApp();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  // Capturamos os dados do pedido IMEDIATAMENTE antes de qualquer limpeza do carrinho
  // Usamos um estado que só é definido uma vez na montagem
  const [orderData] = useState(() => ({
    items: [...cart],
    total: cartTotal,
    date: new Date().toLocaleDateString('pt-BR'),
    number: `LMN-${Math.floor(100000 + Math.random() * 900000)}`
  }));

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  // Limpa o carrinho ao montar a tela de sucesso para finalizar o fluxo de compra
  useEffect(() => {
    if (cart.length > 0) {
      // Pequeno delay para garantir que o estado local capturou tudo
      const timer = setTimeout(() => clearCart(), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePrint = () => {
    // Abre o diálogo de impressão do navegador
    window.print();
  };

  const handleDownloadPDF = () => {
    // No navegador, a melhor forma de "baixar PDF" sem bibliotecas pesadas é disparar o print
    // O usuário pode então escolher "Salvar como PDF"
    alert("Preparando documento... Escolha 'Salvar como PDF' no destino da impressão.");
    window.print();
  };

  // Cálculos do Recibo
  const taxRate = 0.07; // 7% de impostos simulados
  const totalAmount = orderData.total;
  const taxesAmount = totalAmount * taxRate;
  const subtotalAmount = totalAmount - taxesAmount;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Estilos para Impressão - Garante que apenas o recibo saia no papel */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 40px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Hero Success Section */}
      <div className="text-center mb-16 no-print">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-8 relative">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
          <Check size={48} className="text-emerald-600 dark:text-emerald-400 relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
          Pedido Confirmado!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Obrigado por escolher a Lumina. Seu pagamento foi processado com sucesso e estamos preparando seu pacote com todo cuidado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 no-print">
        {/* Order Details Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50 dark:border-slate-700">
            <Package className="text-primary-600" size={24} />
            <h3 className="font-black text-xl">Resumo Operacional</h3>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Número do Pedido</span>
              <span className="font-black tracking-wider text-slate-900 dark:text-white">{orderData.number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Data do Processamento</span>
              <span className="font-bold text-slate-900 dark:text-white">{orderData.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Valor Total</span>
              <span className="font-black text-primary-600">R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-primary-600">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Previsão de Chegada</p>
              <p className="font-bold text-slate-900 dark:text-white">Até {formattedDeliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-primary-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-primary-500/30 flex flex-col">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-primary-500/30">
            <Mail className="text-primary-100" size={24} />
            <h3 className="font-black text-xl">Acompanhamento</h3>
          </div>
          
          <ul className="space-y-6 flex-1">
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black flex-shrink-0">1</div>
              <p className="text-sm font-medium text-primary-50">Confirmação enviada para seu e-mail cadastrado.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black flex-shrink-0">2</div>
              <p className="text-sm font-medium text-primary-50">Notificaremos você via SMS assim que o rastreio for gerado.</p>
            </li>
          </ul>

          <button className="mt-8 w-full bg-white text-primary-600 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-all transform active:scale-95">
            <Star size={18} /> Avaliar Atendimento
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
        <button 
          onClick={() => { setSelectedCategory('Todos'); window.location.hash = ''; }}
          className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <ShoppingBag size={20} />
          Continuar Comprando
        </button>
        <button 
          onClick={() => setIsReceiptOpen(true)}
          className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
        >
          <FileText size={20} />
          Visualizar Recibo Completo
        </button>
      </div>

      {/* Modal de Recibo Premium */}
      {isReceiptOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 no-print">
          <div className="bg-white w-full max-w-2xl max-h-full overflow-y-auto rounded-[2.5rem] shadow-2xl relative flex flex-col">
            {/* Header do Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-2 text-primary-600 font-black tracking-tight">
                <ShieldCheck size={20} />
                LUMINA RECEIPT
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="p-3 bg-slate-100 hover:bg-primary-600 hover:text-white rounded-xl transition-all"
                  title="Imprimir"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => setIsReceiptOpen(false)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conteúdo do Recibo (Área imprimível) */}
            <div id="printable-receipt" className="p-10 text-slate-800 font-sans">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-1">LUMINA</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Premium Fashion Lab</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Rua da Moda, 42 - Jardins</p>
                    <p>São Paulo, SP - 01414-001</p>
                    <p>CNPJ: 12.345.678/0001-99</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-block font-black text-xs tracking-widest uppercase mb-4">
                    Comprovante de Venda
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pedido No.</p>
                  <p className="text-lg font-black">{orderData.number}</p>
                  <p className="text-xs text-slate-500 mt-1">{orderData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12 border-y border-slate-100 py-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Emitido para</h4>
                  <p className="font-bold text-slate-900">Cliente Lumina Premium</p>
                  <p className="text-sm text-slate-500">cliente@email.com</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Forma de Pagamento</h4>
                  <div className="flex items-center justify-end gap-2 font-bold text-slate-900">
                    <CreditCard size={14} />
                    Cartão final 4242
                  </div>
                  <p className="text-sm text-emerald-600 font-bold uppercase mt-1">Status: Liquidado</p>
                </div>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4">Produto</th>
                    <th className="py-4 text-center">Qtd</th>
                    <th className="py-4 text-right">Unitário</th>
                    <th className="py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderData.items.length > 0 ? orderData.items.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-5">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{item.category}</p>
                      </td>
                      <td className="py-5 text-center font-medium">{item.quantity}</td>
                      <td className="py-5 text-right text-slate-500">R$ {item.price.toFixed(2)}</td>
                      <td className="py-5 text-right font-black text-slate-900">R$ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400 italic">Nenhum item encontrado no histórico desta sessão.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end pt-6">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>R$ {subtotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Impostos (estimado 7%)</span>
                    <span>R$ {taxesAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600 font-bold">
                    <span>Frete Express</span>
                    <span>Grátis</span>
                  </div>
                  <div className="flex justify-between text-xl font-black border-t-2 border-slate-900 pt-4 text-slate-900">
                    <span>Total Pago</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Obrigado por sua confiança</p>
                <p className="text-xs text-slate-400 italic">Este é um recibo eletrônico gerado por Lumina Fashion Premium.</p>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-4 sticky bottom-0 z-10">
               <button 
                onClick={handlePrint}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
               >
                 <Printer size={18} /> Imprimir Agora
               </button>
               <button 
                onClick={handleDownloadPDF}
                className="px-8 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
               >
                 <Download size={18} /> Baixar PDF
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 text-center opacity-40 no-print">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Lumina Premium Shopping Experience</p>
      </div>
    </div>
  );
};

export default OrderSuccess;
