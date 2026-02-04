'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FlashIcon,
  DashboardSquare02Icon,
  Shield02Icon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react';

gsap.registerPlugin(ScrollTrigger);

export default function ValueProp() {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Usamos gsap.context para una limpieza fácil de memoria
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          // 1000px de scroll por cada tarjeta para que el ritmo sea calmado
          end: () => `+=${cards.length * 1000}`, 
          pin: true,           // Bloquea la pantalla
          scrub: 1,            // Sincroniza con el movimiento del mouse
          pinSpacing: true,    // CREA el espacio para que las secciones de abajo no suban
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animación: Una entra, se queda, y sale antes de que llegue la siguiente
      cards.forEach((card, i) => {
        // ENTRADA
        tl.fromTo(card, 
          { opacity: 0, y: 60, scale: 0.9, pointerEvents: 'none' }, 
          { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1 }
        );

        // SALIDA (Solo si no es la última)
        if (i < cards.length - 1) {
          tl.to(card, {
            opacity: 0,
            y: -60,
            scale: 1.1,
            duration: 1,
            delay: 0.8 // Tiempo que la tarjeta se queda fija leyendo
          });
        } else {
          // Pausa final para la última tarjeta
          tl.to({}, { duration: 1 });
        }
      });

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    /* IMPORTANTE: relative y z-10 para controlar capas */
    <div ref={triggerRef} className="relative z-10 bg-white">
      <section className="h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- BLOQUE IZQUIERDO: TEXTO FIJO --- */}
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-gema-blue animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-gema-blue">
                Gema Core
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gema-dark mb-6 leading-tight">
              Diseñado para <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gema-blue to-gema-purple">
                equipos reales.
              </span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Eliminamos la fricción administrativa. Lo que antes tomaba 4 horas en Excel, ahora toma 15 minutos en Gema.
            </p>
          </div>

          {/* --- BLOQUE DERECHO: STACK DE TARJETAS --- */}
          <div className="lg:w-2/3 relative w-full h-[550px] flex items-center justify-center">
            
            {/* CARD 1: VELOCIDAD */}
            <div className="feature-card absolute inset-0 flex items-center justify-center opacity-0">
              <div className="w-full max-w-xl p-8 md:p-12 rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white text-yellow-500 flex items-center justify-center mb-6 shadow-sm">
                    <FlashIcon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gema-dark mb-3">Velocidad Instantánea</h3>
                  <p className="text-gray-500 mb-6">La interfaz responde antes de que el servidor conteste.</p>
                  <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg w-fit">
                    <CheckmarkCircle02Icon size={16} /> Carga en &lt;100ms
                  </div>
                </div>
                <div className="hidden md:flex w-40 h-40 bg-white rounded-3xl border border-gray-100 items-center justify-center">
                   <FlashIcon size={64} className="text-yellow-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* CARD 2: UX */}
            <div className="feature-card absolute inset-0 flex items-center justify-center opacity-0">
              <div className="w-full max-w-xl p-8 md:p-12 rounded-[2.5rem] bg-gema-dark text-white border border-gray-800 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-gema-blue flex items-center justify-center mb-6 shadow-sm">
                    <DashboardSquare02Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Curva de aprendizaje cero</h3>
                  <p className="text-gray-400 mb-6">Si tu equipo sabe usar Gmail, ya saben usar Gema.</p>
                </div>
                <div className="hidden md:flex w-40 h-40 bg-white/5 rounded-3xl border border-white/10 items-center justify-center">
                   <DashboardSquare02Icon size={64} className="text-gema-blue" />
                </div>
              </div>
            </div>

            {/* CARD 3: SEGURIDAD */}
            <div className="feature-card absolute inset-0 flex items-center justify-center opacity-0">
              <div className="w-full max-w-xl p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-gema-purple flex items-center justify-center mb-6 shadow-sm">
                    <Shield02Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gema-dark mb-3">Seguridad Enterprise</h3>
                  <p className="text-gray-500 mb-6">Cifrado de grado bancario y auditoría completa de cada movimiento.</p>
                </div>
                <div className="hidden md:flex w-40 h-40 bg-purple-50 rounded-full border-4 border-dashed border-purple-200 items-center justify-center animate-[spin_15s_linear_infinite]">
                   <Shield02Icon size={64} className="text-gema-purple" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}