
import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Package, 
  Users, 
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
  ArrowLeft,
  Check,
  Printer,
  FileText,
  Truck,
  Eye,
  AlertCircle,
  MapPin,
  Phone,
  ChevronLeft,
  Menu,
  Mail,
  MoreVertical,
  Palette,
  ChevronRight,
  Filter,
  PackageCheck,
  Clock,
  Ban
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../constants';
import { Product, Order, Category } from '../types';
import { useApp } from '../context/AppContext';

const AdminDashboard: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    orders, updateOrderStatus,
    categories: availableCategories, addCategory, updateCategory, deleteCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'categories'>('overview');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [orderStatusFilter, setOrderStatusFilter] = useState<Order['status'] | 'All'>('All');
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Estados para Produtos
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newSize, setNewSize] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#7c3aed');
  
  // Estados para Categorias
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');

  // Estados para Pedidos Profissionais
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderActionView, setOrderActionView] = useState<'details' | 'label' | 'receipt' | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: availableCategories[1]?.name || 'Sem Categoria',
    subCategory: '',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as { name: string, hex: string }[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Receita Total', value: 'R$ 24.560,00', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Total de Pedidos', value: orders.length.toString(), change: '+18.2%', icon: ShoppingBag, color: 'text-blue-500' },
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
      subCategory: formData.subCategory || undefined,
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
    setFormData({ name: '', description: '', price: '', stock: '', category: availableCategories[1]?.name || 'Sem Categoria', subCategory: '', images: [], sizes: [], colors: [] });
    setIsAddingProduct(false);
    setEditingProduct(null);
    setNewSize('');
    setNewColorName('');
    setNewColorHex('#7c3aed');
  };

  const handleAddSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize.trim()] }));
      setNewSize('');
    }
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
      }));
      setNewColorName('');
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryInputValue.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryInputValue.trim(), parentCategoryId || undefined);
    } else {
      addCategory(categoryInputValue.trim(), parentCategoryId || undefined);
    }
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryInputValue('');
    setParentCategoryId('');
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryInputValue(cat.name);
    setParentCategoryId(cat.parentId || '');
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

  const handlePrint = () => {
    window.print();
  };

  // Helper para agrupar categorias e subcategorias
  const mainCategories = availableCategories.filter(c => !c.parentId && c.id !== 'cat-todos');
  const getSubcategories = (parentId: string) => availableCategories.filter(c => c.parentId === parentId);

  // Filtragem de Pedidos
  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter === 'All') return true;
    return order.status === orderStatusFilter;
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden">
      {/* Sidebar de Navegação Colapsável */}
      <aside 
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out print:hidden ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-4 flex justify-end">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <div className="mb-6">
            {!isSidebarCollapsed && (
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 px-6">Painel de Controle</h3>
            )}
            <nav className="space-y-1 px-3">
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
                  title={isSidebarCollapsed ? link.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === link.id 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <link.icon size={20} />
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {!isSidebarCollapsed && (
              <button 
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="w-full flex items-center justify-between px-6 mb-4 group text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Categorias
                <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            
            {(isCategoriesExpanded || isSidebarCollapsed) && (
              <div className={`space-y-1 px-3 overflow-hidden transition-all duration-300`}>
                <nav className="space-y-1">
                  {mainCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveTab('products'); setActiveCategoryFilter(cat.name); }}
                      title={isSidebarCollapsed ? cat.name : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'products' && activeCategoryFilter === cat.name
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/10'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    >
                      <Tag size={16} />
                      {!isSidebarCollapsed && <span className="truncate">{cat.name}</span>}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 animate-in fade-in duration-500 bg-slate-100 dark:bg-slate-950 no-scrollbar print:p-0">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {activeTab === 'overview' ? 'Painel de Desempenho' : 
               activeTab === 'products' ? 'Gestão de Estoque' : 
               activeTab === 'categories' ? 'Categorias e Subcategorias' :
               activeTab === 'orders' ? 'Fluxo de Logística' : 'Base de Clientes'}
            </h1>
            <p className="text-slate-500">
              {activeTab === 'orders' ? 'Acompanhe recebimentos e despache mercadorias.' : 'Administre os dados operacionais da Lumina.'}
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
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
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
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Desempenho Semanal</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="vendas" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
                        </AreaChart>
                    </ResponsiveContainer>
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
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Nome da Categoria/Subcategoria</label>
                      <input type="text" required autoFocus value={categoryInputValue} onChange={e => setCategoryInputValue(e.target.value)} placeholder="Ex: Coleção de Inverno..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-lg font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Categoria Pai (Opcional)</label>
                      <select 
                        value={parentCategoryId} 
                        onChange={e => setParentCategoryId(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-lg font-medium"
                      >
                        <option value="">Nenhuma (Tornar Categoria Principal)</option>
                        {availableCategories
                          .filter(c => !c.parentId && c.id !== 'cat-todos' && c.id !== editingCategory?.id)
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-2xl font-black shadow-xl">Salvar</button>
                      <button type="button" onClick={resetCategoryForm} className="px-8 py-5 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold">Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {mainCategories.map((mainCat) => (
                  <div key={mainCat.id} className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl"><Layers size={20} /></div>
                        <div>
                          <h3 className="font-bold text-lg">{mainCat.name}</h3>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Categoria Principal</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditCategory(mainCat)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"><Edit2 size={18} /></button>
                        <button onClick={() => deleteCategory(mainCat.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"><Trash2 size={18} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-12">
                      {getSubcategories(mainCat.id).map(sub => (
                        <div key={sub.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-lg"><Tag size={16} /></div>
                            <span className="font-bold text-sm">{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditCategory(sub)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={() => deleteCategory(sub.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => { setParentCategoryId(mainCat.id); setIsAddingCategory(true); }}
                        className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                      >
                        <Plus size={16} /> Nova Subcategoria
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA: PEDIDOS PROFISSIONAIS (Lógica de Recebimento e Envio) */}
        {activeTab === 'orders' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Filtros de Status */}
            <div className="flex flex-wrap gap-2 mb-4 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                {[
                    { id: 'All', label: 'Todos os Pedidos', icon: Filter },
                    { id: 'Pending', label: 'Pendentes', icon: Clock },
                    { id: 'Shipped', label: 'Enviados', icon: Truck },
                    { id: 'Delivered', label: 'Entregues', icon: PackageCheck },
                    { id: 'Cancelled', label: 'Cancelados', icon: Ban },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setOrderStatusFilter(f.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            orderStatusFilter === f.id 
                            ? 'bg-primary-600 text-white shadow-lg' 
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <f.icon size={14} />
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Modal de Gestão de Pedido (Recebimento e Envio) */}
            {selectedOrder && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm print:static print:bg-white print:p-0">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col print:shadow-none print:max-h-none print:w-full print:rounded-none">
                  
                  {/* Cabeçalho do Modal */}
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${getStatusColor(selectedOrder.status)}`}>
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black">Pedido {selectedOrder.id}</h2>
                        <p className="text-sm text-slate-500">Recebido em {selectedOrder.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24} /></button>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Timeline de Status Logístico */}
                    <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-10">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                        <div className={`absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-700 ${
                            selectedOrder.status === 'Pending' ? 'w-0' :
                            selectedOrder.status === 'Shipped' ? 'w-1/2' :
                            selectedOrder.status === 'Delivered' ? 'w-full' : 'w-0'
                        }`} />

                        {[
                            { id: 'Pending', label: 'Recebido', icon: Clock },
                            { id: 'Shipped', label: 'Enviado', icon: Truck },
                            { id: 'Delivered', label: 'Entregue', icon: PackageCheck }
                        ].map((step, idx) => {
                            const isCompleted = selectedOrder.status === step.id || 
                                              (selectedOrder.status === 'Shipped' && step.id === 'Pending') ||
                                              (selectedOrder.status === 'Delivered');
                            const isCurrent = selectedOrder.status === step.id;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                                        isCompleted 
                                        ? 'bg-primary-600 border-white dark:border-slate-900 text-white shadow-lg' 
                                        : 'bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-900 text-slate-400'
                                    }`}>
                                        <step.icon size={18} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-primary-600' : 'text-slate-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Coluna de Dados */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                                    <UserIcon size={14} /> Dados do Comprador
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-bold">{selectedOrder.customerName}</p>
                                        <p className="text-xs text-slate-500">cliente@email.com</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold flex items-center gap-1.5"><MapPin size={14} className="text-primary-500" /> Endereço de Entrega</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">Av. Paulista, 1500 - Bela Vista, São Paulo - SP<br/>CEP: 01310-200</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                                <h3 className="text-xs font-black uppercase text-slate-400 p-6 border-b border-slate-100 dark:border-slate-800">Itens do Pedido</h3>
                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {/* Mock de itens do pedido */}
                                    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="w-12 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold">LMN</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">Produto Lumina Premium</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Ref: PRD-7788 | Tam: M</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-sm">R$ {selectedOrder.total.toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">Qtd: {selectedOrder.items}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <span className="font-bold">Total Faturado</span>
                                    <span className="text-2xl font-black text-primary-600">R$ {selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Coluna de Ações Logísticas (Recebimento e Envio) */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                                <h3 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Painel de Despacho</h3>
                                
                                <div className="space-y-3">
                                    {selectedOrder.status === 'Pending' && (
                                        <>
                                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl mb-4">
                                                <p className="text-[10px] font-black text-amber-600 uppercase mb-2">Ação Sugerida</p>
                                                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Verifique os itens no estoque e gere a etiqueta de envio.</p>
                                            </div>
                                            <button 
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'Shipped')}
                                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 active:scale-95"
                                            >
                                                <Truck size={18} /> Despachar Pedido
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.status === 'Shipped' && (
                                        <>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl mb-4">
                                                <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Status: Em Trânsito</p>
                                                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Aguardando confirmação de recebimento pelo transportador.</p>
                                            </div>
                                            <button 
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95"
                                            >
                                                <Check size={18} /> Confirmar Entrega
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.status === 'Delivered' && (
                                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-3">
                                                <PackageCheck size={24} />
                                            </div>
                                            <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Fluxo Concluído</p>
                                            <p className="text-xs text-slate-500 mt-2">Este pedido já foi entregue ao cliente final.</p>
                                        </div>
                                    )}

                                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                                        <button 
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                                            className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-xs font-bold"
                                        >
                                            <Ban size={14} /> Cancelar Operação
                                        </button>
                                    )}

                                    {selectedOrder.status === 'Cancelled' && (
                                         <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex flex-col items-center text-center">
                                            <Ban size={24} className="text-rose-600 mb-2" />
                                            <p className="text-sm font-black text-rose-600 uppercase">Cancelado</p>
                                         </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                                <h3 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">Documentação</h3>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold">
                                        Emitir Nota Fiscal <FileText size={14} />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold">
                                        Etiqueta de Envio <Printer size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4 text-center">ID</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4 text-center">Itens</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Gerir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-[10px] text-center text-slate-400">{order.id}</td>
                        <td className="px-6 py-4 font-bold text-sm">{order.customerName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-center">{order.items}</td>
                        <td className="px-6 py-4 font-black text-sm text-primary-600">R$ {order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button 
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white rounded-lg transition-all"
                                title="Processar Pedido"
                            >
                                <ChevronRight size={18} />
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
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
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
                          <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg transition-colors"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: PRODUTOS */}
        {activeTab === 'products' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {isAddingProduct ? (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Item'}</h2>
                  <button onClick={resetProductForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase text-primary-600 border-b border-slate-100 dark:border-slate-700 pb-2 tracking-widest">Informações Gerais</h3>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome do Produto" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                      <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descrição completa do produto..." className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Preço (R$)" className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                        <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="Qtd em Estoque" className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Categoria Principal</label>
                          <select 
                            required 
                            value={formData.category} 
                            onChange={e => {
                              setFormData({
                                ...formData, 
                                category: e.target.value, 
                                subCategory: '' 
                              });
                            }} 
                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                          >
                            <option value="">Selecione...</option>
                            {mainCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Subvariação (Subcat)</label>
                          <select 
                            value={formData.subCategory} 
                            onChange={e => setFormData({...formData, subCategory: e.target.value})} 
                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 transition-shadow disabled:opacity-50"
                            disabled={!formData.category}
                          >
                            <option value="">Nenhuma</option>
                            {availableCategories
                              .filter(c => {
                                const parent = mainCategories.find(mc => mc.name === formData.category);
                                return c.parentId === parent?.id;
                              })
                              .map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)
                            }
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-sm font-black uppercase text-primary-600 border-b border-slate-100 dark:border-slate-700 pb-2 tracking-widest">Configuração de Variantes</h3>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Variações Disponíveis</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="Ex: Pequeno, Médio..." className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl transition-shadow border-none focus:ring-1 focus:ring-primary-500" />
                          <button type="button" onClick={handleAddSize} className="p-2.5 bg-primary-600 text-white rounded-xl transition-transform active:scale-95 shadow-md"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.sizes.map((s, idx) => (
                            <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-600">
                              {s}
                              <button type="button" onClick={() => removeSize(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Subvariações (Identificadores)</label>
                        <div className="flex gap-2 mb-3 items-center">
                          <div className="relative flex-1">
                            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="Nome (Ex: Fosco, Azul)" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl transition-shadow border-none focus:ring-1 focus:ring-primary-500" />
                          </div>
                          <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-12 h-10 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border-none cursor-pointer" />
                          <button type="button" onClick={handleAddColor} className="p-2.5 bg-primary-600 text-white rounded-xl transition-transform active:scale-95 shadow-md"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.colors.map((c, idx) => (
                            <span key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                              <div className="w-3 h-3 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: c.hex }} />
                              {c.name}
                              <button type="button" onClick={() => removeColor(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Galeria de Fotos</label>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors group" onClick={() => fileInputRef.current?.click()}>
                          <Upload size={24} className="mx-auto text-slate-400 mb-2 group-hover:text-primary-500 transition-colors" />
                          <p className="text-xs font-bold text-slate-500">Arraste ou clique para upload</p>
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
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square">
                              <img src={img} className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-100 dark:border-slate-700" />
                              <button type="button" onClick={() => setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                    <button type="submit" className="flex-1 bg-primary-600 text-white py-5 rounded-2xl font-black shadow-xl transform active:scale-95 transition-all">Salvar Alterações</button>
                    <button type="button" onClick={resetProductForm} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold transition-colors hover:bg-slate-200">Cancelar</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Filtrar por nome..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Filtro:</span>
                    <select value={activeCategoryFilter} onChange={(e) => setActiveCategoryFilter(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-0 transition-shadow">
                      <option value="Todos">Todas as Categorias</option>
                      {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <th className="px-6 py-4">Produto</th>
                        <th className="px-6 py-4">Categoria/Sub</th>
                        <th className="px-6 py-4">Preço</th>
                        <th className="px-6 py-4">Estoque</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {products.filter(p => activeCategoryFilter === 'Todos' || p.category === activeCategoryFilter || p.subCategory === activeCategoryFilter).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={p.image} className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                            <span className="font-bold text-sm">{p.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-md w-fit tracking-wider">{p.category}</span>
                              {p.subCategory && <span className="text-[9px] font-medium text-slate-400 pl-1">↳ {p.subCategory}</span>}
                            </div>
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
                                  subCategory: p.subCategory || '',
                                  images: [p.image, ...p.secondaryImages],
                                  sizes: p.sizes || [],
                                  colors: p.colors || []
                                });
                                setIsAddingProduct(true);
                              }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
