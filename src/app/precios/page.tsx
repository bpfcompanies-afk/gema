'use client';
import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  CheckmarkCircle01Icon as CheckmarkCircle02, 
  HelpCircleIcon as HelpCircle,
  Diamond01Icon as Diamond01, 
  Layers01Icon as Layers01, 
  CubeIcon as Cube01, 
  Shield01Icon as Shield01,
  ArrowRight01Icon as ArrowRight01,
  ZapIcon
} from 'hugeicons-react';

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTE TARJETA CON LÓGICA DE FOCO ---
const PricingCard = ({ 
  plan, 
  isAnnual, 
  formatMoney, 
  index, 
  hoveredIndex, 
  setHoveredIndex 
}: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });

  // 1. Cálculos de estado visual
  const isHovered = index === hoveredIndex;
  const isSomeoneElseHovered = hoveredIndex !== null && !isHovered;
  
  // Si nadie está interactuando, el plan "Popular" se destaca por defecto.
  // Si alguien interactúa, esa lógica se anula a favor del hover.
  const isDefaultPopular = plan.isPopular && hoveredIndex === null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onMouseMove={handleMouseMove}
      className={`
        pricing-card relative h-full rounded-3xl transition-all duration-500 ease-out transform-gpu
        ${/* ESTILOS DE ESCALA Y OPACIDAD DINÁMICOS */ ''}
        ${isHovered 
            ? 'scale-110 z-20 shadow-2xl translate-y-[-10px]' // Tú eres el elegido: Crece mucho
            : isSomeoneElseHovered 
                ? 'scale-90 opacity-50 blur-[1px] grayscale-[0.5]' // Otro es el elegido: Hazte pequeño y borroso
                : isDefaultPopular 
                    ? 'scale-105 z-10 shadow-xl border-purple-200' // Estado normal: El popular destaca un poco
                    : 'scale-100 hover:scale-105' // Estado normal: Resto estándar
        }
      `}
    >
      {/* CAPA BORDE / FONDO */}
      <div className={`absolute inset-0 rounded-3xl transition-colors duration-300 ${plan.isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />

      {/* CAPA SPOTLIGHT (Solo visible si es el hover actual) */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${plan.spotlightColor}, transparent 40%)`,
        }}
      />

      {/* CAPA CONTENIDO */}
      <div className={`
        relative h-full rounded-[23px] m-[1px] p-8 flex flex-col overflow-hidden transition-colors duration-300
        ${plan.isDark ? 'bg-gray-900' : 'bg-white'}
      `}>
        
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">
            Recomendado
          </div>
        )}

        <div className="mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm ${plan.iconBg}`}>
            <plan.icon size={24} className={plan.iconColor} variant="solid" />
          </div>
          <h3 className={`text-xl font-bold tracking-tight ${plan.isDark ? 'text-white' : 'text-gray-900'}`}>
            {plan.name}
          </h3>
          <p className={`text-sm mt-2 font-medium ${plan.isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {plan.tagline}
          </p>
        </div>

        <div className="mb-8 min-h-[60px]">
          {plan.contactOnly ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">Contáctanos</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1" key={isAnnual ? 'annual' : 'monthly'}>
                <span className={`text-4xl font-extrabold tracking-tight ${plan.isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatMoney(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                </span>
                <span className={`text-sm font-medium ${plan.isDark ? 'text-gray-400' : 'text-gray-500'}`}>/mes</span>
              </div>
              <div className={`text-xs font-bold mt-2 transition-all duration-300 ${isAnnual ? 'opacity-100 text-green-600' : 'opacity-0'}`}>
                Ahorras 20% anual
              </div>
            </>
          )}
        </div>

        <div className={`w-full h-px mb-8 ${plan.isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

        <ul className="space-y-4 mb-8 flex-1">
          {plan.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm font-medium">
              <div className={`mt-0.5 shrink-0 ${plan.checkColor}`}>
                <CheckmarkCircle02 size={18} />
              </div>
              <span className={plan.isDark ? 'text-gray-300' : 'text-gray-600'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Link href="/contacto" className={`group relative w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${plan.btnClass}`}>
          <span>Seleccionar Plan</span>
          <ArrowRight01 size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredUso, setHoveredUso] = useState<number | null>(null);
  const [hoveredDesarrollo, setHoveredDesarrollo] = useState<number | null>(null);
  const [openInfo, setOpenInfo] = useState<'uso' | 'desarrollo' | null>(null);
  const containerRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const infoUsoRef = useRef<HTMLDivElement>(null);
  const infoDesarrolloRef = useRef<HTMLDivElement>(null);

  const plans = useMemo(() => [
    {
      id: 'basico',
      name: 'Plan Básico',
      tagline: 'Ideal para validar tu operación.',
      monthlyPrice: 210000,
      annualPrice: 168000,
      icon: Cube01,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      spotlightColor: '#06b6d4', 
      checkColor: 'text-cyan-500',
      btnClass: 'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50',
      features: ['1 Compañía', '2 Usuarios', 'Soporte Estándar', 'Acceso Web y Móvil']
    },
    {
      id: 'plus',
      name: 'Plan Plus',
      tagline: 'Para PyMEs en crecimiento.',
      monthlyPrice: 1050000,
      annualPrice: 840000,
      icon: Layers01,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      spotlightColor: '#10b981',
      checkColor: 'text-green-500',
      btnClass: 'bg-white border border-green-200 text-green-700 hover:bg-green-50',
      features: ['5 Compañías', '25 Usuarios', 'Soporte 24/7', 'Mejoras incluidas']
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      tagline: 'Escalabilidad sin fricción.',
      monthlyPrice: 3150000,
      annualPrice: 2520000,
      icon: Diamond01,
      isPopular: true,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      spotlightColor: '#9333ea',
      checkColor: 'text-purple-500',
      btnClass: 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-purple-500/20',
      features: ['15 Compañías', '100 Usuarios', 'Soporte Prioritario', 'Automatización', '50 Horas de Desarrollo Dedicado']
    },
    {
      id: 'black',
      name: 'Enterprise',
      tagline: 'Poder corporativo total.',
      monthlyPrice: 10000000,
      annualPrice: 8000000,
      icon: Shield01,
      isDark: true,
      contactOnly: true,
      iconBg: 'bg-white/10',
      iconColor: 'text-white',
      spotlightColor: '#ffffff',
      checkColor: 'text-white',
      btnClass: 'bg-white text-black hover:bg-gray-200',
      features: ['Ilimitadas', '300+ Usuarios', 'Soporte VIP', 'IA Integrada', 'API Dedicada']
    }
  ], []);

  // --- ANIMACIÓN DE ENTRADA (GSAP) ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Estado inicial: invisibles y bajadas
      gsap.set(".pricing-card-wrapper", { opacity: 0, y: 50 });

      // 2. Animación al hacer scroll
      gsap.to(".pricing-card-wrapper", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15, // Retraso entre cada carta para efecto cascada
        ease: "back.out(1.2)", // Efecto rebote suave al llegar
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Cerrar popover al hacer click fuera
  useLayoutEffect(() => {
    if (!openInfo) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const ref = openInfo === 'uso' ? infoUsoRef.current : infoDesarrolloRef.current;
      if (ref && !ref.contains(target)) setOpenInfo(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openInfo]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <main ref={containerRef} className="bg-white min-h-screen pb-32 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-50 to-white -z-10"></div>
      
      {/* HEADER */}
      <section className="pt-40 pb-20 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
             <ZapIcon size={12} /> Precios Transparentes
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Invierte en el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">futuro de tu fundación</span>
          </h1>
          
          <div className="flex items-center justify-center mt-12">
             <div className="relative flex bg-gray-100 p-1 rounded-xl cursor-pointer select-none border border-gray-200" onClick={() => setIsAnnual(!isAnnual)}>
                <div className={`absolute top-1 bottom-1 w-[120px] bg-white rounded-[9px] shadow-sm transition-all duration-300 ${isAnnual ? 'left-[124px]' : 'left-1'}`}></div>
                <button className={`relative z-10 w-[120px] py-2 text-sm font-bold transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Mensual</button>
                <button className={`relative z-10 w-[120px] py-2 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                   Anual <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-extrabold">-20%</span>
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* SECCIONES DE PRECIOS */}
      <div ref={cardsRef} className="container mx-auto max-w-[1000px] px-4 md:px-8 space-y-20">

        {/* ── LICENCIAS DE USO ── */}
        <div>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gray-200"></div>
            <div ref={infoUsoRef} className="relative flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Licencias de Uso</span>
              <button
                onClick={() => setOpenInfo(openInfo === 'uso' ? null : 'uso')}
                className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-extrabold flex items-center justify-center hover:bg-blue-200 transition-colors shrink-0"
              >i</button>

              {openInfo === 'uso' && (
                <div className="absolute top-9 left-1/2 -translate-x-1/2 z-50 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 p-5">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                  <p className="text-sm font-bold text-gray-900 mb-2">¿Qué es una Licencia de Uso?</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Permiten el acceso completo a la plataforma Gema y a todos sus módulos disponibles.
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-xs text-gray-600"><span className="text-blue-500 mt-0.5">✓</span> Acceso a todos los módulos activos de la plataforma.</li>
                    <li className="flex items-start gap-2 text-xs text-gray-600"><span className="text-blue-500 mt-0.5">✓</span> <span><strong>Plan Plus:</strong> acceso anticipado a nuevas funcionalidades que se desarrollen periódicamente.</span></li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {plans.slice(0, 2).map((plan, index) => (
              <div key={plan.id} className="pricing-card-wrapper h-full flex flex-col p-2">
                <PricingCard
                  plan={plan}
                  isAnnual={isAnnual}
                  formatMoney={formatMoney}
                  index={index}
                  hoveredIndex={hoveredUso}
                  setHoveredIndex={setHoveredUso}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── LICENCIAS DE DESARROLLO ── */}
        <div>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gray-200"></div>
            <div ref={infoDesarrolloRef} className="relative flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Licencias de Desarrollo</span>
              <button
                onClick={() => setOpenInfo(openInfo === 'desarrollo' ? null : 'desarrollo')}
                className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-extrabold flex items-center justify-center hover:bg-purple-200 transition-colors shrink-0"
              >i</button>

              {openInfo === 'desarrollo' && (
                <div className="absolute top-9 left-1/2 -translate-x-1/2 z-50 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 p-5">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                  <p className="text-sm font-bold text-gray-900 mb-2">¿Qué es una Licencia de Desarrollo?</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Incluye todo lo de las licencias de uso, más la capacidad de solicitar funcionalidad personalizada a la medida de tu operación.
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-xs text-gray-600"><span className="text-purple-500 mt-0.5">✓</span> Todo lo incluido en las licencias de uso.</li>
                    <li className="flex items-start gap-2 text-xs text-gray-600"><span className="text-purple-500 mt-0.5">✓</span> Desarrollo de módulos o flujos personalizados para tu fundación.</li>
                    <li className="flex items-start gap-2 text-xs text-gray-600"><span className="text-purple-500 mt-0.5">✓</span> Acompañamiento técnico dedicado durante el desarrollo.</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {plans.slice(2).map((plan, index) => (
              <div key={plan.id} className="pricing-card-wrapper h-full flex flex-col p-2">
                <PricingCard
                  plan={plan}
                  isAnnual={isAnnual}
                  formatMoney={formatMoney}
                  index={index}
                  hoveredIndex={hoveredDesarrollo}
                  setHoveredIndex={setHoveredDesarrollo}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/contacto" className="group inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
            <HelpCircle size={18} />
            <span>¿Necesitas una instalación On-Premise?</span>
            <span className="border-b border-gray-300 group-hover:border-gray-900 pb-0.5 text-gray-900">Contáctanos</span>
          </Link>
        </div>
      </div>
    </main>
  );
}