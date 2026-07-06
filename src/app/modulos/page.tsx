'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ModuleMockup from '@/src/components/ModuleMockup';
import {
  Package01Icon as Package,
  LayerIcon as Layers01,
  Wifi01Icon as WifiSignal,
  Activity01Icon as Activity01,
  Invoice03Icon as Invoice03,
  SecurityCheckIcon as SecurityCheck,
  ArrowRight01Icon as ArrowRight01,
  Wallet02Icon as WalletIcon,
  NoteEditIcon as FormIcon
} from 'hugeicons-react';

const modules = [
  {
    id: 'activos',
    title: 'Activos Fijos',
    icon: Package,
    color: 'text-gema-blue',
    tagline: 'Control total de tu patrimonio.',
    description: 'Olvídate de las hojas de cálculo perdidas. Gema te permite etiquetar, geolocalizar y calcular la depreciación de cada activo en tiempo real.',
    features: [
      'Generación de códigos QR únicos por activo.',
      'Historial de mantenimiento y reparaciones.',
      'Cálculo automático de depreciación contable.',
      'Asignación de responsables (Check-in/Check-out).'
    ]
  },
  {
    id: 'consumibles',
    title: 'Inventario de Consumibles',
    icon: Layers01,
    color: 'text-orange-500',
    tagline: 'Nunca te quedes sin stock crítico.',
    description: 'Gestiona EPPs, papelería, repuestos y cualquier insumo de alta rotación. El sistema aprende tus patrones de consumo y te avisa cuándo comprar.',
    features: [
      'Alertas de stock mínimo configurables.',
      'Métodos de valoración PEPS (FIFO) y Costo Promedio.',
      'Kits de entrega rápida para empleados.',
      'Integración directa con Solicitudes de Compra.'
    ]
  },
  {
    id: 'iot',
    title: 'IoT & Sensores',
    icon: WifiSignal,
    color: 'text-indigo-500',
    tagline: 'Tus máquinas ahora hablan.',
    description: 'Conecta sensores industriales para monitorear temperatura, vibración, humedad y encendido/apagado en tiempo real.',
    features: [
      'Tableros de control en vivo.',
      'Reglas de automatización (Si T > 40°C → Alerta).',
      'Compatibilidad con protocolos MQTT y HTTP.',
      'Histórico de datos para mantenimiento predictivo.'
    ]
  },
  {
    id: 'medica',
    title: 'Gestión Médica',
    icon: Activity01,
    color: 'text-blue-500',
    tagline: 'Salud ocupacional integrada.',
    description: 'Mantén los expedientes clínicos de tus colaboradores al día, gestiona citas y controla el inventario de tu enfermería.',
    features: [
      'Expediente clínico electrónico encriptado.',
      'Control de stock de medicamentos con lotes y caducidad.',
      'Agendamiento de exámenes periódicos.',
      'Reportes de morbilidad y accidentabilidad.'
    ]
  },
  {
    id: 'compras',
    title: 'Compras y Requisiciones',
    icon: Invoice03,
    color: 'text-purple-500',
    tagline: 'Del pedido a la orden, sin burocracia.',
    description: 'Centraliza todas las necesidades de compra de fundación en un solo flujo de aprobación transparente.',
    features: [
      'Flujos de aprobación multinivel.',
      'Comparativo de cotizaciones de proveedores.',
      'Generación automática de Órdenes de Compra (PDF).',
      'Presupuestos por departamento.'
    ]
  },
  {
    id: 'seguridad',
    title: 'Roles y Seguridad',
    icon: SecurityCheck,
    color: 'text-gray-700',
    tagline: 'Control total de quién ve qué.',
    description: 'Define roles personalizados y restringe el acceso a módulos, acciones o datos sensibles. La seguridad no es opcional.',
    features: [
      'RBAC (Role-Based Access Control) granular.',
      'Logs de auditoría inmutables (quién hizo qué y cuándo).',
      'Autenticación de dos factores (2FA).',
      'Sesiones seguras y bloqueos automáticos.'
    ]
  },
  {
    id: 'caja_menor',
    title: 'Caja Menor',
    icon: WalletIcon,
    color: 'text-purple-600',
    tagline: 'Controla cada peso de tus billeteras.',
    description: 'Gestiona billeteras digitales por sede, registra transacciones, valida comprobantes y mantén siempre visible el saldo disponible de tu fundación.',
    features: [
      'Billeteras por sede con saldo en tiempo real.',
      'Flujo de validación de transacciones y archivos.',
      'Categorías de gasto configurables.',
      'Reportes de movimientos y saldos retenidos.'
    ]
  },
  {
    id: 'formularios',
    title: 'Formularios',
    icon: FormIcon,
    color: 'text-blue-500',
    tagline: 'De formulario a documento en un clic.',
    description: 'Crea formularios dinámicos que se convierten automáticamente en documentos Word personalizados. Registra respuestas por beneficiario y exporta todo a Excel cuando lo necesites.',
    features: [
      'Constructor de formularios dinámicos sin código.',
      'Generación automática de plantillas Word con los datos.',
      'Registro histórico de respuestas por persona/beneficiario.',
      'Exportación a Excel con todos los registros del formulario.'
    ]
  }
];

export default function ModulesPage() {
  const [activeId, setActiveId] = useState('activos');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', 
        threshold: 0
      }
    );

    modules.forEach((mod) => {
      const element = document.getElementById(mod.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-white min-h-screen">
      
      {/* HEADER: Ajustado a mayor ancho */}
      <section className="bg-gema-light pt-32 pb-16 border-b border-gray-100 w-full">
        <div className="w-full max-w-450 mx-auto px-6 md:px-12 lg:px-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gema-dark mb-4 max-w-4xl">
            Explora nuestros <span className="text-gradient">Módulos</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl">
            Cada herramienta que necesitas para operar tu fundación, unificada en una sola plataforma.
          </p>
        </div>
      </section>

      {/* CONTENEDOR PRINCIPAL: Full Width Layout */}
      <div className="w-full max-w-450 mx-auto px-6 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        
        {/* --- COLUMNA IZQUIERDA: MENÚ STICKY --- 
            Ahora tiene un ancho fijo (w-72) y no un porcentaje, 
            lo que permite que el contenido ocupe el resto. 
        */}
        <aside className="hidden md:block w-72 lg:w-80 h-fit sticky top-32 shrink-0">
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
              Índice de Módulos
            </p>
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => handleScrollTo(mod.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 text-left group
                  ${activeId === mod.id 
                    ? 'bg-gema-dark text-white shadow-xl shadow-gema-dark/10 translate-x-2' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gema-dark'
                  }`}
              >
                <mod.icon 
                  size={22} 
                  className={activeId === mod.id ? 'text-white' : mod.color} 
                  
                />
                <span className="truncate">{mod.title}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-10 p-6 bg-linear-to-br from-blue-50 to-white rounded-2xl border border-blue-100 text-center shadow-sm">
             <p className="text-sm text-gema-dark font-bold mb-3">¿Necesitas algo a medida?</p>
             <Link href="/contacto" className="text-xs bg-gema-blue text-white px-5 py-3 rounded-full inline-block hover:shadow-lg hover:shadow-blue-500/20 transition-all font-semibold w-full">
               Contactar Soporte
             </Link>
          </div>
        </aside>

        {/* --- COLUMNA DERECHA: CONTENIDO EXPANDIBLE --- 
            Usamos 'flex-1' para que tome todo el espacio restante. 
            También aumentamos el tamaño de los textos y márgenes.
        */}
        <div className="flex-1 min-w-0 space-y-32 pb-32">
          {modules.map((mod) => (
            <section key={mod.id} id={mod.id} className="scroll-mt-32 group">
              
              <div className="flex flex-col xl:flex-row xl:items-start gap-8 mb-10">
                <div className="flex-1">
                    {/* Encabezado */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3.5 rounded-2xl bg-gray-50 border border-gray-100 ${mod.color}`}>
                        <mod.icon size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gema-dark tracking-tight">{mod.title}</h2>
                    </div>

                    <p className="text-2xl text-gema-blue font-medium mb-4 leading-tight">
                        {mod.tagline}
                    </p>

                    <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">
                        {mod.description}
                    </p>
                </div>
              </div>

              {/* MOCKUP VISUAL GRANDE */}
              <div className="w-full mb-12 transform group-hover:scale-[1.005] transition-transform duration-700 ease-out">
                {/* Forzamos una altura mayor en pantallas grandes para que se vea imponente 
                   aspect-video mantiene la proporción 16:9
                */}
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-200/60">
                    <ModuleMockup type={mod.id as 'activos' | 'consumibles' | 'iot' | 'medica' | 'compras' | 'seguridad' | 'caja_menor' | 'formularios'} />
                </div>
              </div>

              {/* Features en Grid de 3 columnas para aprovechar el ancho */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {mod.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50 border border-transparent hover:border-gray-200 transition-colors">
                    <div className="mt-1 min-w-5">
                       <ArrowRight01 size={18} className="text-gema-blue" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Separador sutil entre secciones */}
              <div className="mt-24 h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

            </section>
          ))}
        </div>

      </div>
    </main>
  );
}