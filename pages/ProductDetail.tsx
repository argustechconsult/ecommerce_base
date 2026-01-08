
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Star, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { addToCart, products } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
      if (foundProduct.sizes?.length) setSelectedSize(foundProduct.sizes[0]);
      if (foundProduct.colors?.length) setSelectedColor(foundProduct.colors[0].name);
    }
  }, [productId, products]);

  if (!product) return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-slate-500 animate-pulse">Procurando seu produto...</p>
    </div>
  );

  const images = [product.image, ...(product.secondaryImages || [])];

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <button onClick={() => window.location.hash = ''} className="hover:text-primary-600 transition-colors">Início</button>
        <ChevronRight size={14} />
        <span className="text-slate-500">{product.category}</span>
        <ChevronRight size={14} />
        <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white dark:bg-slate-800 shadow-xl group border border-slate-100 dark:border-slate-700">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-primary-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} visão ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
              Coleção {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                R$ {product.price.toFixed(2)}
              </span>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-sm">{product.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                  Cor: <span className="text-slate-900 dark:text-white">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${
                        selectedColor === c.name ? 'border-primary-600 scale-110 shadow-lg shadow-primary-500/20' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <div className={`w-2 h-2 rounded-full ${['#FFFFFF', '#F5F5DC'].includes(c.hex.toUpperCase()) ? 'bg-black' : 'bg-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400">Selecionar Tamanho</label>
                  <button className="text-xs font-bold text-primary-600 hover:underline">Guia de Medidas</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                        selectedSize === s 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-2xl ${
                isAdded 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 size={24} />
                  Adicionado
                </>
              ) : (
                <>
                  <ShoppingCart size={24} />
                  Adicionar à Sacola
                </>
              )}
            </button>
            <button className="p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-red-100 dark:hover:border-red-900 transition-colors text-slate-400 hover:text-red-500 bg-white dark:bg-slate-900">
              <Heart size={24} />
            </button>
          </div>

          {/* Meta Info */}
          <div className="mt-12 grid grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Disponibilidade</p>
              <p className="text-sm font-bold flex items-center gap-1.5 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Em estoque ({product.stock} unidades)
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Entrega</p>
              <p className="text-sm font-bold">Frete Grátis Express</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
