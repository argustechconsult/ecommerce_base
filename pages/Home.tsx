
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { Sparkles, SearchX, Percent, UserCircle2, ChevronRight } from 'lucide-react';

const PROMO_IMAGES = [
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1534452285544-d4ef505217a9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
];

const Home: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery, 
    setSearchQuery, 
    user 
  } = useApp();

  const mainCategories = categories.filter(c => !c.parentId);
  const currentSubCategories = categories.filter(c => {
    const parent = mainCategories.find(mc => mc.name === selectedCategory);
    return parent && c.parentId === parent.id;
  });

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSub = selectedSubCategory === 'Todas' || p.subCategory === selectedSubCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSub && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-700">
      <Hero />

      <div id="products-section" className="scroll-mt-28 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-widest mb-2">
              <Sparkles size={16} />
              {user ? 'Curadoria Exclusiva' : 'Tendências do Momento'}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {user ? `Olá, ${user.name}!` : 'Curadoria para Você'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            {mainCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory('Todas');
                  setSearchQuery(''); 
                }}
                className={`px-6 py-3 rounded-xl text-lg font-bold transition-all ${
                  selectedCategory === cat.name && !searchQuery
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Subcategorias */}
        {selectedCategory !== 'Todos' && currentSubCategories.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 animate-in slide-in-from-top-2 duration-300">
            <button 
              onClick={() => setSelectedSubCategory('Todas')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                selectedSubCategory === 'Todas' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' 
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              Todas em {selectedCategory}
            </button>
            {currentSubCategories.map(sub => (
              <button 
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  selectedSubCategory === sub.name
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center animate-in zoom-in duration-300">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full mb-6">
            <SearchX size={48} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black mb-2">Nenhum item encontrado</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Não encontramos nenhum item nesta combinação.</p>
          <button 
            onClick={() => {
              setSelectedCategory('Todos');
              setSelectedSubCategory('Todas');
              setSearchQuery('');
            }} 
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-transform"
          >
            Ver todos os produtos
          </button>
        </div>
      )}

      {/* Seção PROMOÇÃO */}
      <div className="mt-32 mb-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2 px-6 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-full">
            <Percent size={16} className="text-rose-600" />
            <h2 className="text-lg font-black uppercase tracking-[0.4em] text-rose-600">PROMOÇÃO</h2>
          </div>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="relative overflow-hidden w-full h-[300px] sm:h-[400px]">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 40s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee flex gap-4 sm:gap-6 h-full">
            {[...PROMO_IMAGES, ...PROMO_IMAGES].map((img, idx) => (
              <div 
                key={idx} 
                className="relative group w-[250px] sm:w-[400px] h-full shrink-0 overflow-hidden rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <img src={img} alt="Promoção Lumina" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">Oferta Especial</span>
                  <h3 className="text-xl font-black leading-tight">Look de Verão<br/><span className="text-rose-400">40% OFF</span></h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
