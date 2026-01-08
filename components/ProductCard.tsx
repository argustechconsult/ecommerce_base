
import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();

  const handleCardClick = () => {
    window.location.hash = `product/${product.id}`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); /* Favoritos */ }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart size={18} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart size={18} /> Add à Sacola
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <Star size={12} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            R$ {product.price.toFixed(2)}
          </span>
          {product.stock < 10 && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">
              Restam apenas {product.stock}!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
