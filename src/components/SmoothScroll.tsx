'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Aseguramos que ScrollTrigger esté registrado
    gsap.registerPlugin(ScrollTrigger);

    // 2. Instanciamos Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // IMPORTANTE: Si tu app tiene un wrapper con overflow, defínelo aquí. 
      // Si es el body, déjalo por defecto.
    });
    lenisRef.current = lenis;

    // 3. SINCRONIZACIÓN CRÍTICA
    // Cada vez que Lenis hace scroll, le avisa a ScrollTrigger que actualice sus cálculos
    lenis.on('scroll', ScrollTrigger.update);

    // 4. Integración con el Ticker de GSAP
    // En lugar de usar requestAnimationFrame nativo, usamos el ticker de GSAP.
    // Esto asegura que las animaciones y el scroll ocurran en el mismo frame exacto.
    const tickerFunction = (time: number) => {
      // GSAP envía el tiempo en segundos, Lenis lo necesita en ms
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFunction);

    // 5. Configuración de Performance
    // Desactivamos lagSmoothing para evitar saltos visuales si el hilo principal se congestiona
    // Esto es vital cuando se usa smooth scroll.
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      gsap.ticker.remove(tickerFunction);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}