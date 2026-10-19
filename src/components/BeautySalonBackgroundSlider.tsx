import React, { useState, useEffect } from 'react';

interface SlideItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

const SALON_SLIDES: SlideItem[] = [
  {
    id: 'salon-interior',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80',
    title: 'Salões de Beleza & Estúdios Modernos',
    category: 'Espaço & Ambiente',
  },
  {
    id: 'hair-styling',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80',
    title: 'Corte, Penteado & Coloração Profissional',
    category: 'Hair Styling',
  },
  {
    id: 'barbershop',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80',
    title: 'Barbearias Clássicas & Visagismo Masculino',
    category: 'Barbearia Premium',
  },
  {
    id: 'manicure-spa',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1920&q=80',
    title: 'Manicure, Nail Design & Spa de Cuidados',
    category: 'Unhas & Estética',
  },
  {
    id: 'hair-cutting',
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1920&q=80',
    title: 'Tratamentos Capilares & Transformação',
    category: 'Beleza & Bem-Estar',
  },
];

export const BeautySalonBackgroundSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SALON_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* 🖼️ Slideshow com transição suave de opacidade e escala lenta */}
      {SALON_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}

      {/* ☀️ Overlay suave e luminoso para destacar as fotos reais do salão */}
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[0.5px]" />

      {/* 🌌 Gradiente sutil radial para foco central límpido */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(2,6,23,0.15)_0%,_rgba(2,6,23,0.45)_75%,_rgba(2,6,23,0.65)_100%)]" />

      {/* 🌊 Gradiente vertical suave */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />
    </div>
  );
};

export default BeautySalonBackgroundSlider;
