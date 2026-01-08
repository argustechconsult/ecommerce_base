
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: "Coleção de Verão 2024",
    subtitle: "Tecidos leves, cores vibrantes.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600",
    color: "bg-blue-600"
  },
  {
    title: "Básicos Eco-Conscientes",
    subtitle: "Moda sustentável para todos os dias.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1600",
    color: "bg-emerald-600"
  },
  {
    title: "Promoção de Temporada",
    subtitle: "Até 50% de desconto em estilos selecionados.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600",
    color: "bg-rose-600"
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[600px] w-full overflow-hidden rounded-3xl group mb-12">
      {SLIDES.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 sm:p-16">
            <div className="max-w-2xl text-white">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${slide.color}`}>
                Destaque
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-lg">
                {slide.subtitle}
              </p>
              <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl">
                Ver Coleção
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <button 
        onClick={() => setCurrent((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setCurrent((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
