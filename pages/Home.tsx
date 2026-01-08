
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { Sparkles, SearchX } from 'lucide-react';

const Home: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();

  // Filtragem robusta: Categoria + Busca
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-700">
      <Hero />

      {/* Featured Section Header - Adicionado ID para âncora de scroll */}
      <div id="products-section" className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 scroll-mt-28">
        <div>
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-widest mb-2">
            <Sparkles size={16} />
            {searchQuery ? 'Resultados da busca' : 'Tendências do Momento'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {searchQuery ? `"${searchQuery}"` : 'Curadoria para Você'}
          </h2>
        </div>

        {/* Categories Tab (Internal Sync with Header) */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchQuery(''); // Limpa busca ao mudar categoria
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat && !searchQuery
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Não encontramos nada para "{searchQuery}" nesta categoria. Tente outros termos ou navegue nas coleções.</p>
          <button 
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
            }} 
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-transform"
          >
            Ver todos os produtos
          </button>
        </div>
      )}

      {/* Banner Section */}
      <div className="mt-24 bg-primary-900 rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,1),transparent)]" />
        <div className="relative px-8 py-16 md:px-20 md:py-24 flex flex-col items-center text-center">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-6 max-w-3xl leading-tight">
            Ganhe 15% OFF na sua Primeira Escolha Premium
          </h2>
          <p className="text-primary-200 text-lg md:text-xl mb-10 max-w-xl">
            Faça parte do Coletivo Lumina e tenha acesso antecipado a drops exclusivos e dicas de moda sustentável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary-400 focus:outline-none backdrop-blur-md"
            />
            <button className="bg-white text-primary-900 hover:bg-primary-50 px-8 py-4 rounded-2xl font-bold transition-transform active:scale-95 whitespace-nowrap">
              Inscrever Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
