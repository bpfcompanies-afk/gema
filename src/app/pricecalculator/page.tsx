'use client';
import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import {
  Package01Icon as PackageIcon,
  Wifi01Icon as WifiIcon,
  Activity01Icon as ActivityIcon,
  Wallet02Icon as WalletIcon,
  NoteEditIcon as FormIcon,
  Diamond01Icon as DiamondIcon,
  LayerIcon as LayersIcon,
  ArrowRight01Icon as ArrowRightIcon,
  Invoice03Icon as InvoiceIcon,
  CheckmarkCircle01Icon as CheckmarkIcon,
  SecurityCheckIcon as LockIcon,
  Layers01Icon as CartIcon,
  Shield01Icon as UserGroupIcon,
  CubeIcon as OrgIcon,
  ZapIcon,
} from 'hugeicons-react';

// ─── PRECIOS ────────────────────────────────────────────────────────────────
const CORE_PRICE = 85_000;
const COMP_PRICE = 40_000;
const USER_UNIT  =  9_000;
const USER_PACK  = 30_000;
const COMPANY    = 35_000;

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

// ─── DATA ────────────────────────────────────────────────────────────────────
type CoreModule = {
  id: string; name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string; bg: string; desc: string;
};
type Complement = { id: string; name: string; requiresCore: string; desc: string; };
interface CartItem { id: string; label: string; price: number; qty: number; }

const CORE_MODULES: CoreModule[] = [
  { id: 'activos',     name: 'Activos Fijos',              icon: PackageIcon,  color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Control y trazabilidad de tu patrimonio empresarial.' },
  { id: 'iot',         name: 'IoT & Sensores',             icon: WifiIcon,     color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Monitoreo en tiempo real de equipos y sensores.' },
  { id: 'medico',      name: 'Gestión Médica',             icon: ActivityIcon, color: 'text-cyan-600',   bg: 'bg-cyan-50',   desc: 'Salud ocupacional integrada para tus colaboradores.' },
  { id: 'cajamenor',   name: 'Caja Menor',                 icon: WalletIcon,   color: 'text-green-600',  bg: 'bg-green-50',  desc: 'Control automatizado de gastos menores y reembolsos.' },
  { id: 'formularios', name: 'Formularios',                icon: FormIcon,     color: 'text-amber-600',  bg: 'bg-amber-50',  desc: 'Digitaliza procesos y flujos de trabajo sin código.' },
  { id: 'dashboards',  name: 'Dashboards',                 icon: DiamondIcon,  color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Indicadores clave y reportes en tiempo real.' },
  { id: 'consumibles', name: 'Inventario de Consumibles',  icon: LayersIcon,   color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Gestión de stock, EPPs e insumos de alta rotación.' },
];

const COMPLEMENTS: Complement[] = [
  { id: 'movimientos',    name: 'Movimientos',         requiresCore: 'activos',     desc: 'Traslados y bajas de activos.' },
  { id: 'procesos-compra',name: 'Procesos de Compra',  requiresCore: 'consumibles', desc: 'Requisición y órdenes de compra.' },
];

// ─── STEPPER ─────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Tu Infraestructura', sub: 'Módulos y complementos' },
  { label: 'Tu Equipo',          sub: 'Usuarios y licencias'   },
  { label: 'Tu Organización',    sub: 'Compañías e instancias' },
];

function StepIndicator({ active, onGo }: { active: number; onGo: (s: number) => void }) {
  return (
    <div className="flex items-start mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-start flex-1 last:flex-none">
          <button type="button" onClick={() => onGo(i)} className="flex flex-col items-center gap-2 group w-full sm:w-auto">
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all duration-300 shrink-0
              ${active === i
                ? 'bg-gema-blue border-gema-blue text-white shadow-lg shadow-blue-200'
                : active > i
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-200 text-gray-400 bg-white group-hover:border-gray-300'}
            `}>
              {active > i ? '✓' : i + 1}
            </div>
            <div className="hidden sm:block text-center">
              <p className={`text-xs font-bold leading-tight ${active === i ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </button>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mt-4 mx-2 sm:mx-3 transition-colors duration-500 ${active > i ? 'bg-emerald-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CORE MODULE CARD (con complemento acoplado) ─────────────────────────────
function CoreModuleCard({
  mod, isSelected, complement, complementSelected,
  onToggleCore, onToggleComplement, onAutoActivate, isFlashing,
}: {
  mod: CoreModule; isSelected: boolean;
  complement?: Complement; complementSelected: boolean;
  onToggleCore: () => void; onToggleComplement: () => void;
  onAutoActivate: () => void; isFlashing: boolean;
}) {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFlashing || !flashRef.current) return;
    const tween = gsap.fromTo(flashRef.current, { opacity: 0.65 }, { opacity: 0, duration: 0.9, ease: 'power2.out' });
    return () => { tween.kill(); };
  }, [isFlashing]);

  return (
    <div className={`
      relative rounded-2xl border-2 overflow-hidden transition-all duration-200
      ${isSelected ? 'border-gema-blue shadow-lg shadow-blue-100/60' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}
    `}>
      {/* Flash overlay para auto-activación */}
      <div ref={flashRef} className="absolute inset-0 z-10 bg-gema-blue/30 pointer-events-none opacity-0" />

      {/* Botón principal del módulo core */}
      <button type="button" onClick={onToggleCore} className="w-full text-left p-5 bg-white hover:bg-gray-50/50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center`}>
            <mod.icon size={20} className={mod.color} />
          </div>
          {isSelected && <div className="text-gema-blue"><CheckmarkIcon size={20} /></div>}
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{mod.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{mod.desc}</p>
        <span className={`text-xs font-bold ${isSelected ? 'text-gema-blue' : 'text-gray-400'}`}>
          {formatCOP(CORE_PRICE)}/mes
        </span>
      </button>

      {/* Complemento acoplado — siempre visible, smart-activation cuando bloqueado */}
      {complement && (
        <button
          type="button"
          onClick={isSelected ? onToggleComplement : onAutoActivate}
          className={`
            w-full flex items-center gap-3 px-5 py-3 text-xs border-t transition-all duration-200
            ${isSelected
              ? complementSelected
                ? 'bg-blue-50 border-blue-100 hover:bg-blue-100/70'
                : 'bg-gray-50 border-gray-100 hover:bg-blue-50/50'
              : 'bg-gray-50/60 border-gray-100 hover:bg-blue-50/40 cursor-pointer'}
          `}
        >
          {/* Checkbox animado */}
          <div className={`
            w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all duration-200
            ${isSelected
              ? complementSelected ? 'bg-gema-blue border-gema-blue' : 'border-gray-300 bg-white'
              : 'border-gray-200 bg-white'}
          `}>
            {isSelected && complementSelected && <span className="text-white text-[8px] font-black leading-none">✓</span>}
            {!isSelected && <LockIcon size={8} className="text-gray-300" />}
          </div>

          <div className="flex-1 text-left min-w-0">
            <span className={`font-semibold ${isSelected ? (complementSelected ? 'text-blue-700' : 'text-gray-700') : 'text-gray-400'}`}>
              {complement.name}
            </span>
            {!isSelected && (
              <span className="text-gray-300 text-[10px] block leading-tight mt-0.5">
                Toca para activar {mod.name} + {complement.name}
              </span>
            )}
          </div>

          <span className={`font-bold shrink-0 tabular-nums ${isSelected && complementSelected ? 'text-gema-blue' : 'text-gray-400'}`}>
            {formatCOP(COMP_PRICE)}/mes
          </span>
        </button>
      )}
    </div>
  );
}

// ─── CONTADOR ────────────────────────────────────────────────────────────────
function Counter({ label, sublabel, value, price, unitLabel = 'unidad', onChange }: {
  label: string; sublabel?: string; value: number; price: number; unitLabel?: string; onChange: (v: number) => void;
}) {
  const active = value > 0;
  return (
    <div className={`rounded-2xl border-2 p-5 transition-all duration-200 ${active ? 'border-gema-blue bg-blue-50/30 shadow-lg shadow-blue-100/50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="font-bold text-sm text-gray-900">{label}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{sublabel}</p>}
        </div>
        <span className={`text-xs font-bold shrink-0 ml-2 ${active ? 'text-gema-blue' : 'text-gray-400'}`}>
          {formatCOP(price)}/{unitLabel}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all ${value === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'}`}>
          −
        </button>
        <span className="text-xl font-extrabold text-gray-900 w-8 text-center tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-full bg-gema-blue text-white flex items-center justify-center text-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm">
          +
        </button>
        {active && <span className="ml-auto text-sm font-bold text-gray-700 tabular-nums">{formatCOP(value * price)}</span>}
      </div>
    </div>
  );
}

// ─── CONTADOR ANIMADO (GSAP) ─────────────────────────────────────────────────
function AnimatedTotal({ total }: { total: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayed = useRef(0);

  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = formatCOP(0);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: displayed.current };
    const tween = gsap.to(obj, {
      val: total,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate() {
        const v = Math.round(obj.val);
        displayed.current = v;
        if (ref.current) ref.current.textContent = formatCOP(v);
      },
    });
    return () => {
      tween.kill();
      displayed.current = Math.round(obj.val);
    };
  }, [total]);

  return <span ref={ref} className="text-2xl font-extrabold text-gray-900 tabular-nums" />;
}

// ─── CARRITO ─────────────────────────────────────────────────────────────────
function CartSummary({ items, total, onCheckout }: { items: CartItem[]; total: number; onCheckout: () => void }) {
  const isEmpty = items.length === 0;
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/60 p-6">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gema-blue/10 flex items-center justify-center shrink-0">
          <CartIcon size={20} className="text-gema-blue" />
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900 leading-tight">Tu Selección</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEmpty ? 'Nada seleccionado aún' : `${items.length} elemento${items.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <CartIcon size={28} className="text-gray-200" />
          </div>
          <p className="text-sm font-semibold text-gray-400">Selecciona módulos o recursos</p>
          <p className="text-xs text-gray-300 mt-1">para ver el resumen aquí</p>
        </div>
      ) : (
        <ul className="space-y-3.5 mb-6">
          {items.map(item => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-900 block leading-snug">{item.label}</span>
                {item.qty > 1 && <span className="text-xs text-gray-400">{item.qty} × {formatCOP(item.price)}</span>}
              </div>
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">{formatCOP(item.qty * item.price)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={`pt-5 border-t border-gray-100 ${isEmpty ? 'opacity-40' : ''}`}>
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-sm text-gray-500 font-medium">Total mensual</span>
          <div className="text-right">
            <AnimatedTotal total={total} />
            <span className="text-xs text-gray-400 block">/mes</span>
          </div>
        </div>

        <button type="button" onClick={onCheckout} disabled={isEmpty}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
            ${isEmpty
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gema-gradient text-white shadow-lg shadow-blue-200 hover:opacity-90 hover:shadow-xl hover:shadow-blue-300/50 active:scale-[0.98]'}`}>
          <span>Solicitar Cotización</span>
          <ArrowRightIcon size={16} />
        </button>

        {!isEmpty && <p className="text-center text-xs text-gray-400 mt-3">Sin compromiso · Te contactamos en 24 h</p>}
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function CheckoutModal({ items, total, onClose }: { items: CartItem[]; total: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold">
          ✕
        </button>
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gema-blue/10 flex items-center justify-center mx-auto mb-4">
            <ZapIcon size={28} className="text-gema-blue" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">¡Casi listo!</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Nuestro equipo revisará tu selección y te enviará una cotización personalizada.
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Resumen de tu plan</h3>
          <ul className="space-y-2.5">
            {items.map(item => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.qty > 1 ? `${item.qty}× ` : ''}{item.label}</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatCOP(item.qty * item.price)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-baseline">
            <span className="font-bold text-gray-900 text-sm">Total mensual</span>
            <span className="font-extrabold text-gema-blue text-lg tabular-nums">{formatCOP(total)}</span>
          </div>
        </div>
        <Link href="/contacto"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gema-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          <span>Hablar con un asesor</span>
          <ArrowRightIcon size={16} />
        </Link>
        <p className="text-center text-xs text-gray-400 mt-4">Próximamente disponible el pago en línea.</p>
      </div>
    </div>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────
export default function PriceCalculatorPage() {
  const [step, setStep]                         = useState(0);
  const [selectedCores, setSelectedCores]       = useState<Set<string>>(new Set());
  const [selectedComps, setSelectedComps]       = useState<Set<string>>(new Set());
  const [userUnits, setUserUnits]               = useState(0);
  const [userPacks, setUserPacks]               = useState(0);
  const [companies, setCompanies]               = useState(0);
  const [flashingCore, setFlashingCore]         = useState<string | null>(null);
  const [showModal, setShowModal]               = useState(false);

  const containerRef    = useRef<HTMLDivElement>(null);
  const stepContentRef  = useRef<HTMLDivElement>(null);
  const isMounted       = useRef(false);

  // ── Navegación entre pasos con fade ──────────────────────────────────────
  const navigateStep = useCallback((next: number) => {
    if (next < 0 || next > 2) return;
    if (!stepContentRef.current) { setStep(next); return; }
    gsap.to(stepContentRef.current, {
      opacity: 0, y: 8, duration: 0.15,
      onComplete: () => setStep(next),
    });
  }, []);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (!stepContentRef.current) return;
    gsap.fromTo(stepContentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
    );
  }, [step]);

  // ── Lógica de módulos ────────────────────────────────────────────────────
  const toggleCore = useCallback((id: string) => {
    setSelectedCores(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        const deps = COMPLEMENTS.filter(c => c.requiresCore === id).map(c => c.id);
        setSelectedComps(p2 => { const n2 = new Set(p2); deps.forEach(d => n2.delete(d)); return n2; });
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleComp = useCallback((id: string) => {
    setSelectedComps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Smart activation: complemento bloqueado → activa core + complemento + flash
  const autoActivate = useCallback((coreId: string, compId: string) => {
    setSelectedCores(prev => new Set([...prev, coreId]));
    setSelectedComps(prev  => new Set([...prev, compId]));
    setFlashingCore(coreId);
    setTimeout(() => setFlashingCore(null), 1100);
  }, []);

  // ── Totales ──────────────────────────────────────────────────────────────
  const total =
    selectedCores.size * CORE_PRICE +
    selectedComps.size * COMP_PRICE +
    userUnits * USER_UNIT +
    userPacks * USER_PACK +
    companies * COMPANY;

  const cartItems: CartItem[] = [
    ...Array.from(selectedCores).map(id => ({ id, label: CORE_MODULES.find(m => m.id === id)!.name, price: CORE_PRICE, qty: 1 })),
    ...Array.from(selectedComps).map(id => ({ id, label: `${COMPLEMENTS.find(c => c.id === id)!.name} (Complemento)`, price: COMP_PRICE, qty: 1 })),
    ...(userUnits > 0 ? [{ id: 'uu', label: 'Usuarios individuales', price: USER_UNIT, qty: userUnits }] : []),
    ...(userPacks > 0 ? [{ id: 'up', label: 'Paquetes × 5 usuarios', price: USER_PACK, qty: userPacks }] : []),
    ...(companies > 0 ? [{ id: 'co', label: 'Compañías', price: COMPANY, qty: companies }] : []),
  ];

  // ── Animación de entrada ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.page-fade', { opacity: 0, y: 24 });
      gsap.to('.page-fade', { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-white min-h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-white -z-10" />

      {/* HEADER */}
      <section className="pt-40 pb-14 px-6 text-center relative z-10 page-fade">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
          <ZapIcon size={12} /> Calculadora de Precio
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Arma tu <span className="text-gradient">plan ideal</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
          Configura tu plataforma en 3 pasos. Sin contratos largos, sin costos ocultos.
        </p>
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── COLUMNA IZQUIERDA ─────────────────── */}
          <div>
            <div className="page-fade">
              <StepIndicator active={step} onGo={navigateStep} />
            </div>

            {/* Contenido del paso */}
            <div ref={stepContentRef} className="page-fade">

              {/* PASO 1: INFRAESTRUCTURA */}
              {step === 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Infraestructura</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Elige los módulos base de tu operación a{' '}
                      <span className="font-semibold text-gray-700">{formatCOP(CORE_PRICE)}/mes</span> cada uno.
                      Los complementos aparecen acoplados a su módulo y puedes añadirlos con un clic.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {CORE_MODULES.map(mod => {
                      const comp = COMPLEMENTS.find(c => c.requiresCore === mod.id);
                      return (
                        <CoreModuleCard
                          key={mod.id}
                          mod={mod}
                          isSelected={selectedCores.has(mod.id)}
                          complement={comp}
                          complementSelected={comp ? selectedComps.has(comp.id) : false}
                          onToggleCore={() => toggleCore(mod.id)}
                          onToggleComplement={() => comp && toggleComp(comp.id)}
                          onAutoActivate={() => comp && autoActivate(mod.id, comp.id)}
                          isFlashing={flashingCore === mod.id}
                        />
                      );
                    })}
                  </div>

                  {(selectedCores.size > 0 || selectedComps.size > 0) && (
                    <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                      {selectedCores.size > 0 && (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                          {selectedCores.size} módulo{selectedCores.size > 1 ? 's' : ''} core · {formatCOP(selectedCores.size * CORE_PRICE)}/mes
                        </span>
                      )}
                      {selectedComps.size > 0 && (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                          {selectedComps.size} complemento{selectedComps.size > 1 ? 's' : ''} · {formatCOP(selectedComps.size * COMP_PRICE)}/mes
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PASO 2: EQUIPO */}
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Equipo</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Agrega usuarios individualmente o en paquetes de 5. El paquete te ahorra{' '}
                      <span className="font-semibold text-emerald-600">{formatCOP(5 * USER_UNIT - USER_PACK)}</span>{' '}
                      respecto al precio por unidad.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Counter
                      label="Usuario individual"
                      sublabel="Acceso completo a la plataforma"
                      value={userUnits} price={USER_UNIT} unitLabel="usuario" onChange={setUserUnits}
                    />
                    <Counter
                      label="Paquete × 5 usuarios"
                      sublabel={`Ahorra ${formatCOP(5 * USER_UNIT - USER_PACK)} vs. unitario`}
                      value={userPacks} price={USER_PACK} unitLabel="paquete" onChange={setUserPacks}
                    />
                  </div>
                  {(userUnits > 0 || userPacks > 0) && (
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{userUnits + userPacks * 5} usuarios</span> en total ·{' '}
                        <span className="font-bold text-gema-blue tabular-nums">{formatCOP(userUnits * USER_UNIT + userPacks * USER_PACK)}/mes</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PASO 3: ORGANIZACIÓN */}
              {step === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Organización</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Cada compañía es una instancia independiente con datos, usuarios y configuración propios.{' '}
                      <span className="font-semibold text-gray-700">{formatCOP(COMPANY)}/compañía</span>.
                    </p>
                  </div>
                  <div className="max-w-sm">
                    <Counter
                      label="Compañía"
                      sublabel="Instancia de empresa independiente"
                      value={companies} price={COMPANY} unitLabel="compañía" onChange={setCompanies}
                    />
                  </div>
                  {companies > 0 && (
                    <div className="mt-4 max-w-sm p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{companies} compañía{companies > 1 ? 's' : ''}</span> ·{' '}
                        <span className="font-bold text-gema-blue tabular-nums">{formatCOP(companies * COMPANY)}/mes</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navegación entre pasos */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => navigateStep(step - 1)} disabled={step === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                ← Anterior
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {STEPS.map((_, i) => (
                  <button key={i} type="button" onClick={() => navigateStep(i)}
                    className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2 bg-gema-blue' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'}`}
                  />
                ))}
              </div>

              <button type="button" onClick={() => navigateStep(step + 1)} disabled={step === 2}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${step === 2 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 bg-gray-50'}`}>
                Siguiente <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>

          {/* ── CARRITO (sticky) ────────────────────── */}
          <div className="lg:sticky lg:top-28 page-fade">
            <CartSummary items={cartItems} total={total} onCheckout={() => setShowModal(true)} />
          </div>
        </div>
      </div>

      {/* MOBILE: barra flotante */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur border-t border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">{cartItems.length} elemento{cartItems.length > 1 ? 's' : ''}</p>
              <p className="font-extrabold text-gray-900 text-lg tabular-nums">{formatCOP(total)}/mes</p>
            </div>
            <button type="button" onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gema-gradient text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
              Cotizar <ArrowRightIcon size={15} />
            </button>
          </div>
        </div>
      )}

      {showModal && <CheckoutModal items={cartItems} total={total} onClose={() => setShowModal(false)} />}
    </main>
  );
}
