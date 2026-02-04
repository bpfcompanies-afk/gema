"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  DeliveryBox02Icon as BoxIcon, 
  Alert01Icon, 
  Search01Icon, 
  FilterHorizontalIcon,
  // Iconos Nuevos:
  Wifi01Icon,
  ThermometerIcon,
  DropletIcon,
  HandBeaterIcon as HeartBeatIcon,
  UserCircleIcon,
  Invoice01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Shield02Icon,
  LockKeyIcon,
  Settings01Icon
} from "hugeicons-react"; 

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  type: 'activos' | 'consumibles' | 'iot' | 'medica' | 'compras' | 'seguridad';
}

export default function ModuleMockup({ type }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. Entrada General
    tl.from(containerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });

    // 2. UI Base
    tl.from(".mockup-ui-base", {
      opacity: 0,
      y: -10,
      stagger: 0.05,
      duration: 0.4
    }, "-=0.3");

    // 3. ANIMACIONES ESPECÍFICAS
    if (type === 'activos') {
      tl.from(".asset-row", { x: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.2)" }, "-=0.2");
    }

    if (type === 'consumibles') {
        tl.from(".consumable-card", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.2");
        tl.from(".progress-fill", { width: 0, duration: 1, ease: "power2.out", stagger: 0.15 }, "-=0.2");
    }

    if (type === 'iot') {
        tl.from(".iot-sensor", { scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2");
        // Animación continua del radar
        gsap.to(".radar-ping", { scale: 2, opacity: 0, duration: 2, repeat: -1, ease: "power1.out" });
    }

    if (type === 'medica') {
        tl.from(".patient-info", { x: -20, opacity: 0, duration: 0.5 }, "-=0.2");
        tl.from(".vital-card", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.2");
        // La línea del ECG se anima con CSS, pero la hacemos aparecer aquí
        tl.from(".ecg-line", { opacity: 0, duration: 1 }, "-=0.5");
    }

    if (type === 'compras') {
        tl.from(".flow-step", { x: -30, opacity: 0, stagger: 0.2, duration: 0.6, ease: "power3.out" }, "-=0.2");
        tl.from(".flow-arrow", { scaleX: 0, opacity: 0, stagger: 0.2, duration: 0.4 }, "-=0.8");
    }

    if (type === 'seguridad') {
        tl.from(".user-row", { y: 15, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.2");
        tl.from(".toggle-switch", { scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.4");
    }

  }, { scope: containerRef, dependencies: [type] });

  // --- RENDERIZADO DE CONTENIDO INTERNO ---
  const renderContent = () => {
    switch (type) {
      // 1. ACTIVOS
      case 'activos':
        return (
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 mockup-ui-base w-full">
                <h3 className="text-xs font-bold text-gray-700">Listado de Activos</h3>
                <div className="flex gap-2">
                    <div className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center gap-1 text-gray-400 shadow-sm"><Search01Icon size={10}/></div>
                    <div className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center gap-1 text-gray-400 shadow-sm"><FilterHorizontalIcon size={10}/></div>
                </div>
            </div>
            <div className="space-y-2 w-full">
                {[{ name: "MacBook Pro M2", id: "ACT-001", loc: "Diseño", st: "active" }, { name: "Silla Aeron", id: "ACT-042", loc: "Gerencia", st: "active" }, { name: "Proyector 4K", id: "ACT-105", loc: "Sala A", st: "main" }].map((item, i) => (
                    <div key={i} className="asset-row w-full flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100"><BoxIcon size={14} /></div>
                            <div><p className="text-[10px] font-bold text-gray-800">{item.name}</p><p className="text-[9px] text-gray-400">{item.id}</p></div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${item.st === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    </div>
                ))}
            </div>
          </div>
        );

      // 2. CONSUMIBLES
      case 'consumibles':
        return (
          <div className="flex flex-col h-full">
            <div className="mb-4 mockup-ui-base flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-700">Bodega Principal</h3>
                <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 font-bold">1 Crítico</span>
            </div>
            <div className="space-y-3">
                <div className="consumable-card bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-gray-700">Papel Bond</span><span className="text-[9px] font-bold text-green-600">85%</span></div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="progress-fill h-full bg-green-500 w-[85%]"></div></div>
                </div>
                <div className="consumable-card bg-white p-3 rounded-lg border border-red-100 shadow-sm relative">
                    <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-gray-700">Guantes</span><span className="text-[9px] font-bold text-red-600">12%</span></div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="progress-fill h-full bg-red-500 w-[12%]"></div></div>
                </div>
            </div>
          </div>
        );

      // 3. IOT & SENSORES
      case 'iot':
        return (
            <div className="flex flex-col h-full w-full">
                <div className="flex justify-between items-center mb-4 mockup-ui-base">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                        <h3 className="text-xs font-bold text-gray-700">Sensores Planta 1</h3>
                    </div>
                    <Wifi01Icon size={12} className="text-gray-400"/>
                </div>
                
                <div className="grid grid-cols-2 gap-3 h-full">
                    {/* Sensor Principal (Radar) */}
                    <div className="iot-sensor col-span-2 bg-slate-900 rounded-xl p-3 flex items-center justify-between text-white relative overflow-hidden shadow-lg">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div>
                            <p className="text-[9px] text-blue-300 mb-1">CALIDAD DE AIRE</p>
                            <p className="text-xl font-bold">98<span className="text-sm text-blue-300 font-normal">%</span></p>
                        </div>
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="radar-ping absolute inset-0 border border-blue-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* Sensor Temperatura */}
                    <div className="iot-sensor bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-2"><ThermometerIcon size={16}/></div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">24°C</p>
                            <p className="text-[9px] text-gray-400">Estable</p>
                        </div>
                    </div>

                    {/* Sensor Humedad */}
                    <div className="iot-sensor bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-500 flex items-center justify-center mb-2"><DropletIcon size={16}/></div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">45%</p>
                            <p className="text-[9px] text-gray-400">Humedad</p>
                        </div>
                    </div>
                </div>
            </div>
        );

      // 4. GESTIÓN MÉDICA
   case 'medica':
  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-1"> {/* Padding mínimo para no pegar al borde */}
      {/* Contenedor Grid Principal: Apilado en móvil, Grid en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 h-full">
          
          {/* COLUMNA IZQUIERDA: Perfil */}
          {/* Ajuste: border-b en móvil, border-r en desktop */}
          <div className="col-span-1 md:col-span-4 flex md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4 md:py-2 animate-enter" style={{ animationDelay: '0ms' }}>
              
              {/* Foto de Paciente: Más pequeña en móvil */}
              <div className="relative mb-0 md:mb-4 shrink-0">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-blue-500 to-sky-300 p-0.5 md:p-1 shadow-md transition-transform hover:scale-105 duration-300">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <UserCircleIcon size={40} className="text-blue-100 md:hidden" />
                          <UserCircleIcon size={60} className="text-blue-100 hidden md:block" />
                      </div>
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 md:w-5 md:h-5 bg-emerald-500 border-2 md:border-4 border-white rounded-full animate-pulse"></span>
              </div>

              {/* Información Básica: Alineación horizontal en móvil para ahorrar espacio vertical */}
              <div className="text-right md:text-center flex-1 md:w-full space-y-1 md:space-y-4 ml-4 md:ml-0">
                  <div>
                      <h3 className="text-sm md:text-base font-bold text-gray-800 leading-tight">Ana García</h3>
                      <p className="text-[9px] md:text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">UCI-02 • ID: 8829</p>
                  </div>
                  
                  {/* Info detallada: Oculta o compacta en móvil pequeño si es necesario */}
                  <div className="hidden md:block space-y-3 w-full px-1">
                      {['Edad', 'Sexo', 'Peso'].map((label) => (
                          <div key={label} className="flex justify-between text-xs border-b border-gray-50 pb-1.5">
                              <span className="text-gray-400">{label}</span>
                              <span className="font-bold text-gray-700">
                                  {label === 'Edad' ? '34 años' : label === 'Sexo' ? 'Femenino' : '62 kg'}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* COLUMNA DERECHA: Monitoreo */}
          <div className="col-span-1 md:col-span-8 flex flex-col gap-2 md:gap-3 h-full overflow-hidden">
              
              {/* 1. Gráfica Vitales (ECG) - Altura reducida en móvil */}
              <div className="vital-card shrink-0 bg-slate-900 rounded-xl h-20 md:h-28 relative overflow-hidden flex items-center border border-slate-800 shadow-lg group animate-enter" style={{ animationDelay: '100ms' }}>
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex gap-2">
                      <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-emerald-400 bg-emerald-900/50 px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/20">
                          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-50 animate-pulse"></span> Live
                      </span>
                  </div>
                  <svg className="w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 160 60">
                      <defs>
                          <pattern id="ecg-pattern" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
                              <path className="stroke-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" 
                                    d="M0,30 L20,30 L25,10 L35,50 L40,30 L60,30 L65,10 L75,50 L80,30 L100,30 L105,10 L115,50 L120,30" 
                                    fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                          </pattern>
                      </defs>
                      <rect x="0" y="0" width="300%" height="100%" fill="url(#ecg-pattern)" style={{ animation: 'scroll-ecg 10s linear infinite' }} />
                  </svg>
              </div>

              {/* 2. Grid de Datos - Layout de 2 columnas siempre, pero con padding reducido */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1 overflow-hidden">
                  
                  {/* Card BPM */}
                  <div className="vital-card bg-rose-50 border border-rose-100 rounded-xl p-3 md:p-4 flex flex-col justify-between animate-enter" style={{ animationDelay: '200ms' }}>
                      <div className="flex items-center gap-1.5 text-rose-500">
                          <div className="p-1 md:p-1.5 bg-white rounded-md shadow-sm"><HeartBeatIcon size={14}/></div>
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">Ritmo</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                          <p className="text-2xl md:text-4xl font-black text-gray-800 tracking-tighter">72</p>
                          <span className="text-[10px] text-rose-500 font-bold">BPM</span>
                      </div>
                      <div className="w-full bg-rose-200/50 h-1 md:h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full animate-fill-bar" style={{ width: '70%' }}></div>
                      </div>
                  </div>

                  {/* Card SpO2 */}
                  <div className="vital-card bg-sky-50 border border-sky-100 rounded-xl p-3 md:p-4 flex flex-col justify-between animate-enter" style={{ animationDelay: '300ms' }}>
                      <div className="flex items-center gap-1.5 text-sky-500">
                          <div className="p-1 md:p-1.5 bg-white rounded-md shadow-sm"><DropletIcon size={14}/></div>
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">O2</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                          <p className="text-2xl md:text-4xl font-black text-gray-800 tracking-tighter">98</p>
                          <span className="text-[10px] text-sky-500 font-bold">%</span>
                      </div>
                      <div className="w-full bg-sky-200/50 h-1 md:h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full animate-fill-bar" style={{ width: '98%' }}></div>
                      </div>
                  </div>
              </div>

          </div>
      </div>

            <style jsx>{`
                @keyframes scroll-ecg {
                    from { transform: translateX(0); }
                    to { transform: translateX(-120px); }
                }
                
                /* Animación de entrada: deslizar hacia arriba y aparecer */
                .animate-enter {
                    opacity: 0;
                    transform: translateY(10px);
                    animation: enter-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }

                @keyframes enter-up {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Animación para las barras de progreso */
                @keyframes fill-bar {
                    from { width: 0; }
                }
                .animate-fill-bar {
                    animation: fill-bar 1s ease-out forwards;
                }
            `}</style>
          </div>
        );

      // 5. COMPRAS Y REQUISICIONES
      case 'compras':
        return (
            <div className="flex flex-col h-full justify-center w-full">
                <div className="mb-4 text-center mockup-ui-base">
                    <h3 className="text-xs font-bold text-gray-700">Flujo de Aprobación</h3>
                    <p className="text-[9px] text-gray-400">Req #4902 - Laptops IT</p>
                </div>

                <div className="flex items-center justify-between px-1">
                    {/* Paso 1: Solicitud */}
                    <div className="flow-step flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Invoice01Icon size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-600">Solicitud</p>
                    </div>

                    {/* Flecha animada */}
                    <div className="flow-arrow flex-1 h-[2px] bg-gray-100 mx-2 relative overflow-hidden">
                         <div className="absolute inset-0 bg-blue-400 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>

                    {/* Paso 2: Aprobación */}
                    <div className="flow-step flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <CheckmarkCircle02Icon size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-600">Aprobación</p>
                    </div>

                    {/* Flecha */}
                    <div className="flow-arrow flex-1 h-[2px] bg-gray-100 mx-2"></div>

                    {/* Paso 3: Compra */}
                    <div className="flow-step flex flex-col items-center gap-2 opacity-50">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center shadow-sm">
                            <BoxIcon size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-400">Recepción</p>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes shimmer { 100% { transform: translateX(100%); } }
                `}</style>
            </div>
        );

      // 6. ROLES Y SEGURIDAD
      case 'seguridad':
        return (
            <div className="flex flex-col h-full w-full">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 mockup-ui-base">
                     <h3 className="text-xs font-bold text-gray-700">Control de Acceso</h3>
                     <Shield02Icon size={12} className="text-gray-400"/>
                </div>

                <div className="space-y-3 w-full">
                    {[
                        { name: "Admin General", role: "Super Admin", access: true },
                        { name: "Gerente Planta", role: "Editor", access: true },
                        { name: "Auditor Externo", role: "Solo Lectura", access: false },
                    ].map((user, i) => (
                        <div key={i} className="user-row flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <UserCircleIcon size={16}/>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-800">{user.name}</p>
                                    <div className="flex items-center gap-1">
                                        <LockKeyIcon size={8} className="text-gray-400"/>
                                        <p className="text-[9px] text-gray-400">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Toggle Switch Simulado */}
                            <div className={`toggle-switch w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${user.access ? 'bg-blue-500 justify-end' : 'bg-gray-200 justify-start'}`}>
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
        
      default:
        return <div className="p-4 text-xs text-gray-400">Selecciona un tipo de módulo</div>;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] flex items-center justify-center p-2">
      {/* WINDOW SHELL */}
      <div className="w-full h-full min-h-[450px] bg-slate-50 rounded-xl border border-gray-200/80 shadow-2xl shadow-gray-200/50 flex flex-col overflow-hidden relative">
        
        {/* Barra de Título */}
        <div className="h-9 bg-white border-b border-gray-100 flex items-center px-4 justify-between z-10 mockup-ui-base">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500/20"></div>
            </div>
            <div className="text-[10px] font-medium text-gray-300">gema.app</div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-12 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-3 z-10 mockup-ui-base">
                <div className="w-6 h-6 rounded-md bg-blue-600 shadow-lg shadow-blue-200 mb-2 flex items-center justify-center text-white text-[10px] font-bold">G</div>
                <div className="w-4 h-4 rounded bg-gray-100"></div>
                <div className="w-4 h-4 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                </div>
                <div className="w-4 h-4 rounded bg-gray-100"></div>
                <div className="mt-auto w-4 h-4 rounded text-gray-300"><Settings01Icon size={16}/></div>
            </div>

            {/* AREA DE CONTENIDO */}
            <div className="flex-1 bg-slate-50/50 p-4 overflow-hidden relative">
                {/* Elemento decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
}