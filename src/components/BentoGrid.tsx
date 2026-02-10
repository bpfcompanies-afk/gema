'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { 
  Package01Icon, 
  Wifi01Icon, 
  Activity01Icon, 
  Invoice03Icon, 
  SecurityCheckIcon, 
  LayerAddIcon, 
  ArrowRight01Icon 
} from 'hugeicons-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: 'activos',
    title: 'Activos Fijos',
    Icon: Package01Icon,
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1', // Original
    bg: 'bg-cyan-500 text-white',
    description: 'Control de maquinaria y equipos. Depreciación automática y ubicación exacta.',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  },
  {
    id: 'iot',
    title: 'IoT & Sensores',
    Icon: Wifi01Icon,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1', // Original
    bg: 'bg-violet-500 text-white',
    description: 'Monitoreo 24/7 de temperatura y estado.',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  },
  {
    id: 'medica',
    title: 'Gestión Médica',
    Icon: Activity01Icon,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-2', // Original (Tarjeta Alta)
    bg: 'bg-blue-500 text-white',
    description: 'Expedientes clínicos y control de insumos hospitalarios.',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  },
  {
    id: 'compras',
    title: 'Compras',
    Icon: Invoice03Icon,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1', // Original
    bg: 'bg-green-500 text-white',
    description: 'Flujos de aprobación y órdenes de compra.',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    Icon: SecurityCheckIcon,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1', // Original
    bg: 'bg-yellow-500 text-white',
    description: 'Control de acceso granular (RBAC).',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  },
  {
    id: 'consumibles',
    title: 'Consumibles',
    Icon: LayerAddIcon, 
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1', // Original
    bg: 'bg-orange-500 text-white',
    description: 'Gestión de inventario rotativo y EPPs.',
    accentColor: 'text-white',
    visualColor: 'bg-white/10'
  }
];

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".bento-card", 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%' }
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
  };

  return (
    <section className="py-24 px-6 bg-gray-50/50 w-full" id="modulos">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gema-dark mb-4">
            Todo conectado. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gema-blue to-gema-purple">Nada complicado.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Módulos independientes que funcionan como un solo organismo.
          </p>
        </div>

        {/* GRID LAYOUT:
           Restaurado md:grid-cols-3 y auto-rows-[180px] para que las tarjetas 
           tengan la proporción exacta que tenías antes.
        */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[180px]">
          {cards.map((card) => (
            <div 
              key={card.id}
              onMouseMove={handleMouseMove}
              className={`
                bento-card group relative overflow-hidden rounded-3xl border border-gray-100 shadow-sm 
                transition-all duration-500 
                ${card.colSpan} ${card.rowSpan} ${card.bg}
                hover:shadow-xl hover:border-gray-200
                flex flex-col
              `}
            >
              
              {/* --- SPOTLIGHT LAYER --- */}
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-30 hidden md:block"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.06), transparent 40%)`
                }}
              />

              {/* --- CONTENIDO --- */}
              <div className="p-6 md:p-8 flex flex-col h-full relative z-10 justify-between">
                 
                 {/* Header: Icon & Title */}
                 <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${card.visualColor} ${card.accentColor}`}>
                          <card.Icon size={24} strokeWidth={1.5} />
                        </div>
                        {/* Flecha Desktop */}
                        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <div className="w-8 h-8 rounded-full bg-gema-dark flex items-center justify-center text-white">
                            <ArrowRight01Icon size={16} />
                          </div>
                        </div>
                    </div>

                    <h3 className={`text-xl font-bold `}>
                        {card.title}
                    </h3>
                 </div>

                 {/* VISUAL DE FONDO (Decorativo) */}
                 <div className="absolute bottom-[-20px] right-[-20px] opacity-50 pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                    <card.Icon size={140} className={card.id === 'iot' ? 'text-white' : 'text-white'} />
                 </div>

                 {/* --- DESCRIPCIÓN --- 
                    Estrategia: 
                    1. Mobile: Bloque estático (Static position), siempre visible.
                    2. Desktop: Posición absoluta (Overlay), aparece con hover.
                 */}
                 <div className={`
                    mt-4 pt-4 relative border-t 
                    md:absolute md:inset-0 md:p-8 md:bg-white/95 md:backdrop-blur-xl md:flex md:flex-col md:justify-center md:items-center md:text-center md:border-0
                    md:translate-y-[110%] md:group-hover:translate-y-0 md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.23,1,0.32,1)]
                    z-20
                 `}>
                    
                    {/* Elementos duplicados para Desktop Overlay */}
                    <card.Icon size={48} className={`hidden md:block mb-4 ${card.accentColor}`} strokeWidth={1.5} />
                    <h4 className="hidden md:block text-lg font-bold text-gema-dark mb-2">{card.title}</h4>

                    <p className={`text-sm leading-relaxed mb-4 text-white md:text-gray-600`}>
                      {card.description}
                    </p>

                    <Link 
                      href="/modulos" 
                      className={`
                        inline-flex items-center gap-2 text-sm font-bold border-b transition-all hover:gap-3 pb-0.5
                        md:bg-gema-dark md:text-white md:px-6 md:py-2.5 md:rounded-full md:border-0 md:hover:bg-gema-blue md:shadow-lg
                        
                      `}
                    >
                      <span>Ver detalles</span>
                      <ArrowRight01Icon size={16} />
                    </Link>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}