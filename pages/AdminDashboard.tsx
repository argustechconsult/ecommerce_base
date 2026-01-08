
import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Package, 
  Users, 
  // Fix: Added missing User icon import aliased as UserIcon
  User as UserIcon,
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Search,
  Trash2,
  Edit2,
  LayoutDashboard,
  Tag,
  ChevronDown,
  Upload,
  X,
  Layers,
  Calendar,
  CreditCard,
  Mail,
  MoreVertical,
  ExternalLink,
  ArrowLeft,
  Check,
  Printer,
  FileText,
  Truck,
  Eye,
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_CUSTOMERS } from '../constants';
import { Product, Order } from '../types';
import { useApp } from '../context/AppContext';

const AdminDashboard: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    categories: availableCategories, addCategory, updateCategory, deleteCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'categories'>('overview');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  
  // Estados para Produtos
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newSize, setNewSize] = useState('');
  
  // Estados para Categorias
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [categoryInputValue, setCategoryInputValue] = useState('');

  // Estados para Pedidos Profissionais
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderActionView, setOrderActionView] = useState<'details' | 'label' | 'receipt' | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: availableCategories[1] || availableCategories[0],
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as { name: string, hex: string }[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Receita Total', value: 'R$ 24.560,00', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Total de Pedidos', value: '456', change: '+18.2%', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Produtos Ativos', value: products.length.toString(), change: '+2 novos', icon: Package, color: 'text-primary-500' },
    { label: 'Total de Clientes', value: '1.230', change: '+5.4%', icon: Users, color: 'text-violet-500' },
  ];

  const chartData = [
    { name: 'Seg', vendas: 4000 },
    { name: 'Ter', vendas: 3000 },
    { name: 'Qua', vendas: 2000 },
    { name: 'Qui', vendas: 2780 },
    { name: 'Sex', vendas: 1890 },
    { name: 'Sab', vendas: 2390 },
    { name: 'Dom', vendas: 3490 },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      image: formData.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
      secondaryImages: formData.images.slice(1),
      rating: editingProduct?.rating || 5.0,
      sizes: formData.sizes,
      colors: formData.colors
    };

    if (editingProduct) updateProduct(newProduct);
    else addProduct(newProduct);
    resetProductForm();
  };

  const resetProductForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: availableCategories[1] || availableCategories[0], images: [], sizes: [], colors: [] });
    setIsAddingProduct(false);
    setEditingProduct(null);
    setNewSize('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryInputValue.trim()) return;

    if (editingCategoryOldName) {
      updateCategory(editingCategoryOldName, categoryInputValue.trim());
    } else {
      addCategory(categoryInputValue.trim());
    }
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryInputValue('');
    setIsAddingCategory(false);
    setEditingCategoryOldName(null);
  };

  const startEditCategory = (catName: string) => {
    setEditingCategoryOldName(catName);
    setCategoryInputValue(catName);
    setIsAddingCategory(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Delivered': return 'Entregue';
      case 'Shipped': return 'Enviado';
      case 'Pending': return 'Pendente';
      case 'Cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Funções de Impressão
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row -mx-4 min-h-[calc(100vh-5rem)]">
      {/* Sidebar de Navegação */}
      <aside className="w-full lg:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 print:hidden">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 px-3">Painel de Controle</h3>
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'categories', label: 'Categorias', icon: Layers },
              { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
              { id: 'customers', label: 'Clientes', icon: Users },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === link.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button 
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            className="w-full flex items-center justify-between px-3 mb-4 group text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Acesso Rápido
            <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isCategoriesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <nav className="space-y-1">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveTab('products'); setActiveCategoryFilter(cat); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'products' && activeCategoryFilter === cat
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/10'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Tag size={16} />
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-6 lg:p-10 animate-in fade-in duration-500 overflow-y-auto print:p-0">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {activeTab === 'overview' ? 'Painel de Desempenho' : 
               activeTab === 'products' ? 'Gestão de Estoque' : 
               activeTab === 'categories' ? 'Categorias de Produtos' :
               activeTab === 'orders' ? 'Gerenciamento de Pedidos' : 'Base de Clientes'}
            </h1>
            <p className="text-slate-500">
              {activeTab === 'overview' ? 'Acompanhe as métricas de vendas em tempo real.' : 'Administre os dados operacionais da Lumina.'}
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'products' && !isAddingProduct && (
              <button onClick={() => setIsAddingProduct(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-primary-500/20 transition-all transform active:scale-95">
                <Plus size={18} /> Novo Produto
              </button>
            )}
            {activeTab === 'categories' && !isAddingCategory && (
              <button onClick={() => setIsAddingCategory(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-primary-500/20 transition-all transform active:scale-95">
                <Plus size={18} /> Criar Categoria
              </button>
            )}
          </div>
        </header>

        {/* ABA: VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm h-[400px]">
                <h3 className="text-xl font-bold mb-6">Fluxo de Vendas (7 dias)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="vendas" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Vendas Recentes</h3>
                <div className="space-y-4">
                  {MOCK_ORDERS.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black">{order.customerName[0]}</div>
                        <div>
                          <p className="font-bold text-sm">{order.customerName}</p>
                          <p className="text-xs text-slate-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">R$ {order.total.toFixed(2)}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: CATEGORIAS */}
        {activeTab === 'categories' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {isAddingCategory ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl">
                  <button onClick={resetCategoryForm} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm">
                    <ArrowLeft size={16} /> Voltar para a Lista
                  </button>
                  <form onSubmit={handleSaveCategory} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Nome da Categoria</label>
                      <input type="text" required autoFocus value={categoryInputValue} onChange={e => setCategoryInputValue(e.target.value)} placeholder="Ex: Coleção de Inverno..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-lg font-medium" />
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-2xl font-black shadow-xl">Salvar</button>
                      <button type="button" onClick={resetCategoryForm} className="px-8 py-5 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold">Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCategories.map((cat) => (
                  <div key={cat} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 text-primary-600 rounded-2xl"><Tag size={20} /></div>
                      <div>
                        <h3 className="font-bold">{cat}</h3>
                        <p className="text-xs text-slate-500">{products.filter(p => p.category === cat || cat === 'Todos').length} Itens</p>
                      </div>
                    </div>
                    {cat !== 'Todos' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditCategory(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit2 size={18} /></button>
                        <button onClick={() => deleteCategory(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: PEDIDOS PROFISSIONAIS */}
        {activeTab === 'orders' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* Modal de Gestão de Pedido */}
            {selectedOrder && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm print:static print:bg-white print:p-0">
                <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col print:shadow-none print:max-h-none print:w-full print:rounded-none ${orderActionView !== 'details' ? 'bg-slate-50' : ''}`}>
                  
                  {/* Cabeçalho do Modal */}
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${getStatusColor(selectedOrder.status)}`}>
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black">Pedido {selectedOrder.id}</h2>
                        <p className="text-sm text-slate-500">Gerenciado em {selectedOrder.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setOrderActionView(orderActionView === 'details' ? 'label' : 'details')}
                        className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors font-bold text-xs flex items-center gap-2"
                      >
                        {orderActionView === 'details' ? <><Truck size={16} /> Ver Etiqueta</> : <><ArrowLeft size={16} /> Voltar</>}
                      </button>
                      <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-slate-100 rounded-xl"><X size={24} /></button>
                    </div>
                  </div>

                  {/* Conteúdo Dinâmico do Modal */}
                  <div className="flex-1 p-8">
                    {orderActionView === 'details' && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                        {/* Coluna 1: Dados Cliente e Entrega */}
                        <div className="lg:col-span-2 space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                              <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Informações do Cliente</h3>
                              <div className="space-y-3">
                                <p className="font-bold flex items-center gap-2"><UserIcon size={16} className="text-primary-500" /> {selectedOrder.customerName}</p>
                                <p className="text-sm text-slate-500 flex items-center gap-2"><Mail size={16} /> cliente@email.com</p>
                                <p className="text-sm text-slate-500 flex items-center gap-2"><Phone size={16} /> (11) 98877-6655</p>
                              </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                              <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Endereço de Entrega</h3>
                              <div className="space-y-1">
                                <p className="text-sm font-bold flex items-center gap-2"><MapPin size={16} className="text-primary-500" /> Av. Paulista, 1500</p>
                                <p className="text-sm text-slate-500 ml-6">Bela Vista, São Paulo - SP</p>
                                <p className="text-sm text-slate-500 ml-6">CEP: 01310-200</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <h3 className="text-xs font-black uppercase text-slate-400 p-6 border-b border-slate-100 dark:border-slate-800">Itens do Pedido</h3>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                              {[1, 2].map((i) => (
                                <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                  <img src={products[i % products.length].image} className="w-12 h-16 rounded-lg object-cover" />
                                  <div className="flex-1">
                                    <p className="font-bold text-sm">{products[i % products.length].name}</p>
                                    <p className="text-xs text-slate-500">Tamanho: M | Cor: Original</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-black text-sm">R$ {products[i % products.length].price.toFixed(2)}</p>
                                    <p className="text-xs text-slate-400">Qtd: 1</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                              <span className="font-bold">Total do Pedido</span>
                              <span className="text-2xl font-black text-primary-600">R$ {selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Coluna 2: Ações de Gestão */}
                        <div className="space-y-6">
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Fluxo do Pedido</h3>
                            <div className="space-y-3">
                              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-bold text-sm border border-amber-100 dark:border-amber-900/50">
                                <AlertCircle size={18} /> Manter Pendente
                              </button>
                              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-bold text-sm border border-blue-100 dark:border-blue-900/50">
                                <Truck size={18} /> Marcar como Enviado
                              </button>
                              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold text-sm border border-emerald-100 dark:border-emerald-900/50">
                                <Check size={18} /> Confirmar Entrega
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold text-sm border border-rose-100 dark:border-rose-900/50">
                                <Trash2 size={18} /> Cancelar Pedido
                              </button>
                            </div>
                          </div>

                          <div className="bg-primary-600 p-6 rounded-3xl text-white shadow-xl shadow-primary-500/20">
                            <h3 className="text-xs font-black uppercase text-white/60 mb-4 tracking-widest">Documentação</h3>
                            <div className="space-y-3">
                              <button onClick={() => setOrderActionView('label')} className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-bold text-sm">
                                Gerar Etiqueta <Printer size={16} />
                              </button>
                              <button onClick={() => setOrderActionView('receipt')} className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-bold text-sm">
                                Emitir Recibo <FileText size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visão de Etiqueta Logística (Otimizada para Impressão) */}
                    {orderActionView === 'label' && (
                      <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="bg-white p-10 border-4 border-black w-full max-w-md text-black font-mono shadow-lg print:border-2 print:shadow-none print:m-0">
                          <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
                            <h2 className="text-3xl font-black">LUMINA</h2>
                            <div className="text-right">
                              <p className="text-[10px] font-bold">ETIQUETA DE ENVIO</p>
                              <p className="text-xl font-bold"># {selectedOrder.id}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="border-b-2 border-black pb-4">
                              <p className="text-[10px] font-bold mb-1">DESTINATÁRIO</p>
                              <p className="text-lg font-black uppercase">{selectedOrder.customerName}</p>
                              <p className="text-sm">AV. PAULISTA, 1500 - BELA VISTA</p>
                              <p className="text-sm font-bold">01310-200 - SÃO PAULO - SP</p>
                            </div>

                            <div className="border-b-2 border-black pb-4">
                              <p className="text-[10px] font-bold mb-1">REMETENTE</p>
                              <p className="text-xs font-bold">LUMINA FASHION PREMIUM</p>
                              <p className="text-[10px]">RUA DA MODA, 42 - JARDINS</p>
                              <p className="text-[10px]">01414-001 - SÃO PAULO - SP</p>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                              <div className="space-y-2">
                                <div className="bg-black w-48 h-12" /> {/* Simulação de Barcode */}
                                <p className="text-[8px] text-center">887766554433221100</p>
                              </div>
                              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center border-2 border-black">
                                <div className="grid grid-cols-3 gap-0.5">
                                  {[...Array(9)].map((_, i) => <div key={i} className={`w-3 h-3 ${i%2===0 ? 'bg-black' : 'bg-transparent'}`} />)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 flex gap-4 print:hidden">
                          <button onClick={handlePrint} className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2">
                            <Printer size={20} /> Imprimir Etiqueta
                          </button>
                          <button onClick={() => setOrderActionView('details')} className="px-8 py-4 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                        </div>
                      </div>
                    )}

                    {/* Visão de Recibo / Nota Simples */}
                    {orderActionView === 'receipt' && (
                      <div className="max-w-2xl mx-auto bg-white p-12 border border-slate-200 text-slate-800 animate-in slide-in-from-bottom-4 duration-300 print:border-0 print:p-0">
                        <div className="flex justify-between items-center mb-10 border-b pb-8">
                          <div>
                            <h2 className="text-2xl font-black text-primary-600">LUMINA FASHION</h2>
                            <p className="text-xs text-slate-500">CNPJ: 12.345.678/0001-99</p>
                          </div>
                          <div className="text-right">
                            <h3 className="font-bold">RECIBO DE VENDA</h3>
                            <p className="text-sm">Pedido: {selectedOrder.id}</p>
                            <p className="text-sm">Data: {selectedOrder.date}</p>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Cliente</h4>
                          <p className="font-bold">{selectedOrder.customerName}</p>
                          <p className="text-sm text-slate-500">cliente@email.com</p>
                        </div>

                        <table className="w-full mb-10">
                          <thead className="border-b-2 border-slate-900">
                            <tr className="text-left text-xs font-black uppercase">
                              <th className="py-3">Descrição</th>
                              <th className="py-3 text-center">Qtd</th>
                              <th className="py-3 text-right">Unitário</th>
                              <th className="py-3 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[1, 2].map(i => (
                              <tr key={i} className="text-sm">
                                <td className="py-4">Produto Lumina Premium #{i}</td>
                                <td className="py-4 text-center">1</td>
                                <td className="py-4 text-right">R$ {(selectedOrder.total / 2).toFixed(2)}</td>
                                <td className="py-4 text-right">R$ {(selectedOrder.total / 2).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex justify-end">
                          <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal</span>
                              <span>R$ {selectedOrder.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Frete</span>
                              <span>R$ 0,00</span>
                            </div>
                            <div className="flex justify-between text-lg font-black border-t pt-3">
                              <span>Total Pago</span>
                              <span>R$ {selectedOrder.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-20 pt-8 border-t text-center text-[10px] text-slate-400 uppercase tracking-widest print:hidden">
                          Obrigado pela preferência!
                        </div>

                        <div className="mt-8 flex justify-center gap-4 print:hidden">
                          <button onClick={handlePrint} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                            <Printer size={20} /> Imprimir Recibo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Buscar ID ou Cliente..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4 text-center">ID</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4 text-center">Qtd Itens</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-[10px] text-center text-slate-400">{order.id}</td>
                        <td className="px-6 py-4 font-bold text-sm">{order.customerName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-center">{order.items}</td>
                        <td className="px-6 py-4 font-black text-sm">R$ {order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => { setSelectedOrder(order); setOrderActionView('details'); }}
                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto"
                            title="Gerenciar Pedido"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: CLIENTES */}
        {activeTab === 'customers' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Nome do Cliente</th>
                      <th className="px-6 py-4">Contato</th>
                      <th className="px-6 py-4 text-center">Pedidos</th>
                      <th className="px-6 py-4">Total Gasto</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_CUSTOMERS.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 flex items-center justify-center font-bold text-sm">
                            {customer.name[0]}
                          </div>
                          <span className="font-bold text-sm">{customer.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5"><Mail size={12} /> {customer.email}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-center">{customer.orders}</td>
                        <td className="px-6 py-4 font-black text-sm text-emerald-600">R$ {customer.totalSpent.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: PRODUTOS (CRUD) */}
        {activeTab === 'products' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {isAddingProduct ? (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Item'}</h2>
                  <button onClick={resetProductForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><X size={24} /></button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase text-primary-600 border-b border-slate-100 dark:border-slate-700 pb-2">Informações Gerais</h3>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome do Produto" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500" />
                      <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descrição completa do produto..." className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Preço (R$)" className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none" />
                        <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="Qtd em Estoque" className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none" />
                      </div>
                      <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none">
                        {availableCategories.filter(c => c !== 'Todos').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase text-primary-600 border-b border-slate-100 dark:border-slate-700 pb-2">Variações e Mídia</h3>
                      <div className="flex gap-2">
                        <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="Tamanho (P, M, G...)" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl" />
                        <button type="button" onClick={() => { if(newSize.trim()){ setFormData(prev => ({...prev, sizes: [...prev.sizes, newSize.trim()]})); setNewSize(''); } }} className="p-2.5 bg-primary-600 text-white rounded-xl"><Plus size={20} /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map(s => <span key={s} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold">{s}</span>)}
                      </div>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center cursor-pointer hover:border-primary-500" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold">Upload de Imagens</p>
                        <input type="file" ref={fileInputRef} onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          Array.from(files).forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormData(prev => ({...prev, images: [...prev.images, reader.result as string]}));
                            reader.readAsDataURL(file as Blob);
                          });
                        }} className="hidden" multiple accept="image/*" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} className="aspect-square object-cover rounded-xl" />
                            <button onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-2xl font-black shadow-xl transform active:scale-95 transition-all">Salvar Alterações</button>
                    <button type="button" onClick={resetProductForm} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold">Cancelar</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Filtrar por nome..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">Filtrar Categoria:</span>
                    <select value={activeCategoryFilter} onChange={(e) => setActiveCategoryFilter(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-0">
                      {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Produto</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4">Preço</th>
                        <th className="px-6 py-4">Estoque</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {products.filter(p => activeCategoryFilter === 'Todos' || p.category === activeCategoryFilter).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-sm">{p.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">{p.category}</span>
                          </td>
                          <td className="px-6 py-4 font-black text-sm">R$ {p.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <span className={p.stock < 10 ? 'text-red-500 font-black' : ''}>{p.stock}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => {
                                setEditingProduct(p);
                                setFormData({
                                  name: p.name,
                                  description: p.description,
                                  price: p.price.toString(),
                                  stock: p.stock.toString(),
                                  category: p.category,
                                  images: [p.image, ...p.secondaryImages],
                                  sizes: p.sizes || [],
                                  colors: p.colors || []
                                });
                                setIsAddingProduct(true);
                              }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={16} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
