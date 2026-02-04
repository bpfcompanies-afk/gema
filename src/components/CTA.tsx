'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-content",
        { y: 50, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-gema-light overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gema-blue/10 to-gema-purple/10 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="container mx-auto px-6 text-center z-10 cta-content">
        <h2 className="text-4xl md:text-6xl font-bold text-gema-dark mb-6 tracking-tight">
          Deja de luchar con el ERP. <br />
          <span className="text-gradient">Empieza a usar Gema.</span>
        </h2>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Únete a las empresas que han reducido sus tiempos de gestión administrativa en un 40% con nuestra plataforma modular.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/contacto" 
            className="px-10 py-4 rounded-full bg-gema-dark text-white font-bold text-lg hover:bg-gema-blue transition-colors duration-300 shadow-xl shadow-gema-dark/20"
          >
            Hablar con Ventas
          </Link>
          <Link 
            href="/precios" 
            className="px-10 py-4 rounded-full border-2 border-gema-dark/10 text-gema-dark font-bold text-lg hover:border-gema-dark transition-colors duration-300 bg-white"
          >
            Ver Planes
          </Link>
        </div>
      </div>
    </section>
  );
}