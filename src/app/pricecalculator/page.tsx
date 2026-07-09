'use client';
import { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import {
  Package01Icon as PackageIcon,
  Wifi01Icon as WifiIcon,
  Activity01Icon as ActivityIcon,
  Wallet02Icon as WalletIcon,
  NoteEditIcon as FormIcon,
  Diamond01Icon as DiamondIcon,
  LayerIcon as LayersIcon,
  Idea01Icon as IdeaIcon,
  ArrowRight01Icon as ArrowRightIcon,
  CheckmarkCircle01Icon as CheckmarkIcon,
  SecurityCheckIcon as LockIcon,
  Layers01Icon as CartIcon,
  ZapIcon,
} from 'hugeicons-react';

// ─── PLAZOS ──────────────────────────────────────────────────────────────────
type Term = 'mensual' | '3m' | '6m' | '12m';

const TERMS: { id: Term; label: string; shortLabel: string }[] = [
  { id: 'mensual', label: 'Mes a mes',          shortLabel: 'Mensual'  },
  { id: '3m',      label: 'Contrato 3 Meses',   shortLabel: '3 meses'  },
  { id: '6m',      label: 'Contrato 6 Meses',   shortLabel: '6 meses'  },
  { id: '12m',     label: 'Contrato 12 Meses',  shortLabel: '12 meses' },
];

// ─── PRECIOS ────────────────────────────────────────────────────────────────
const CORE_PRICE: Record<Term, number> = { mensual: 89_000, '3m': 84_000, '6m': 78_000, '12m': 70_000 };
const COMP_PRICE: Record<Term, number> = { mensual: 35_000, '3m': 33_000, '6m': 30_000, '12m': 28_000 };

const ARMA_MEDIDA_PRICE: Record<Term, number>     = { mensual: 139_000, '3m': 132_000, '6m': 122_000, '12m': 110_000 };
const OPERACION_TOTAL_PRICE: Record<Term, number> = { mensual: 189_000, '3m': 179_000, '6m': 165_000, '12m': 150_000 };

const COMPANY_PRICE: Record<Term, number>   = { mensual: 39_000, '3m': 37_000, '6m': 34_000, '12m': 30_000 };
const USER_UNIT_PRICE: Record<Term, number> = { mensual: 11_000, '3m': 9_000,  '6m': 8_000,  '12m': 7_000  };
const USER_PACK_PRICE: Record<Term, number> = { mensual: 35_000, '3m': 29_000, '6m': 25_000, '12m': 19_000 };

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

// ─── MODALIDAD ───────────────────────────────────────────────────────────────
type ModalityId = 'carta' | 'arma_medida' | 'operacion_total';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODALITY_OPTIONS: { id: ModalityId; name: string; tagline: string; icon: React.ComponentType<any> }[] = [
  { id: 'carta',           name: 'A la Carta',              tagline: 'Elige tus módulos uno por uno.',                            icon: CartIcon },
  { id: 'arma_medida',     name: 'Arma tu Medida',          tagline: 'Elige exactamente 3 módulos por un precio fijo.',           icon: PackageIcon },
  { id: 'operacion_total', name: 'Operación Total',         tagline: 'Todos los módulos incluidos, sin elegir nada.',             icon: DiamondIcon },
];

// ─── DATA ────────────────────────────────────────────────────────────────────
type CoreModule = {
  id: string; name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string; bg: string; desc: string;
};
type Complement = { id: string; name: string; requiresCore: string; desc: string; };
interface CartItem { id: string; label: string; price: number; qty: number; note?: string; included?: boolean; }

const CORE_MODULES: CoreModule[] = [
  { id: 'activos',     name: 'Activos Fijos',              icon: PackageIcon,  color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Control y trazabilidad de tu patrimonio.' },
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

const ALL_CORE_IDS = new Set(CORE_MODULES.map(m => m.id));
const ALL_COMP_IDS = new Set(COMPLEMENTS.map(c => c.id));

// ─── CONSTRUCTOR DE IDEAS (servicio aparte, no es un módulo) ─────────────────
const CONSTRUCTOR_PRICE = 79_000; // precio fijo, no varía según el plazo de contrato

// ─── STEPPER ─────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Tu Modalidad',      sub: 'Plan base'              },
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

// ─── SELECTOR DE PLAZO ───────────────────────────────────────────────────────
function TermSelector({ term, onChange }: { term: Term; onChange: (t: Term) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {TERMS.map(t => {
        const active = term === t.id;
        return (
          <button
            key={t.id} type="button"
            onClick={() => onChange(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all
              ${active
                ? 'border-gema-blue bg-gema-blue text-white shadow-sm'
                : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}
          >
            {t.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

// ─── TARJETA DE MODALIDAD ────────────────────────────────────────────────────
function ModalityCard({ opt, active, price, onSelect }: {
  opt: typeof MODALITY_OPTIONS[number]; active: boolean; price: string; onSelect: () => void;
}) {
  return (
    <button
      type="button" onClick={onSelect}
      className={`text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
        active ? 'border-gema-blue bg-blue-50/30 shadow-lg shadow-blue-100/50' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-gema-blue/10' : 'bg-gray-50'}`}>
          <opt.icon size={20} className={active ? 'text-gema-blue' : 'text-gray-400'} />
        </div>
        {active && <div className="text-gema-blue"><CheckmarkIcon size={20} /></div>}
      </div>
      <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{opt.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">{opt.tagline}</p>
      <span className={`text-xs font-bold ${active ? 'text-gema-blue' : 'text-gray-400'}`}>{price}</span>
    </button>
  );
}

// ─── CORE MODULE CARD (con complemento acoplado) ─────────────────────────────
type ModuleCardMode = 'unlimited' | 'capped' | 'readonly';

function CoreModuleCard({
  mod, isSelected, complement, complementSelected,
  onToggleCore, onToggleComplement, onAutoActivate, isFlashing,
  mode, corePrice, compPrice, coreBlocked, compBlocked,
}: {
  mod: CoreModule; isSelected: boolean;
  complement?: Complement; complementSelected: boolean;
  onToggleCore: () => void; onToggleComplement: () => void;
  onAutoActivate: () => void; isFlashing: boolean;
  mode: ModuleCardMode; corePrice: number; compPrice: number;
  coreBlocked: boolean; compBlocked: boolean;
}) {
  const flashRef = useRef<HTMLDivElement>(null);
  const readOnly = mode === 'readonly';

  useEffect(() => {
    if (!isFlashing || !flashRef.current) return;
    const tween = gsap.fromTo(flashRef.current, { opacity: 0.65 }, { opacity: 0, duration: 0.9, ease: 'power2.out' });
    return () => { tween.kill(); };
  }, [isFlashing]);

  return (
    <div className={`
      relative rounded-2xl border-2 overflow-hidden transition-all duration-200
      ${isSelected ? 'border-gema-blue shadow-lg shadow-blue-100/60' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}
      ${coreBlocked ? 'opacity-60' : ''}
    `}>
      <div ref={flashRef} className="absolute inset-0 z-10 bg-gema-blue/30 pointer-events-none opacity-0" />

      <button
        type="button"
        onClick={readOnly || coreBlocked ? undefined : onToggleCore}
        disabled={readOnly || coreBlocked}
        className={`w-full flex items-center gap-4 text-left p-4 bg-white transition-colors ${readOnly || coreBlocked ? 'cursor-default' : 'hover:bg-gray-50/50'}`}
      >
        <div className={`w-11 h-11 rounded-xl ${mod.bg} flex items-center justify-center shrink-0`}>
          <mod.icon size={20} className={mod.color} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 leading-tight truncate">{mod.name}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">{mod.desc}</p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {isSelected && <CheckmarkIcon size={18} className="text-gema-blue" />}
          {mode === 'unlimited' && (
            <span className={`text-xs font-bold whitespace-nowrap ${isSelected ? 'text-gema-blue' : 'text-gray-400'}`}>
              {formatCOP(corePrice)}/mes
            </span>
          )}
          {mode === 'capped' && (
            <span className={`text-xs font-bold whitespace-nowrap ${isSelected ? 'text-gema-blue' : coreBlocked ? 'text-gray-300' : 'text-gray-400'}`}>
              {isSelected ? 'Incluido' : coreBlocked ? 'Cupo lleno' : '1 cupo'}
            </span>
          )}
          {mode === 'readonly' && (
            <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">Incluido</span>
          )}
        </div>
      </button>

      {complement && (
        <button
          type="button"
          onClick={readOnly || compBlocked ? undefined : (isSelected ? onToggleComplement : onAutoActivate)}
          disabled={readOnly || compBlocked}
          className={`
            w-full flex items-center gap-3 px-4 py-3 text-xs border-t transition-all duration-200
            ${readOnly
              ? 'bg-emerald-50/50 border-emerald-100'
              : compBlocked
                ? 'bg-gray-50 border-gray-100 opacity-60 cursor-default'
                : isSelected
                  ? complementSelected
                    ? 'bg-blue-50 border-blue-100 hover:bg-blue-100/70'
                    : 'bg-gray-50 border-gray-100 hover:bg-blue-50/50'
                  : 'bg-gray-50/60 border-gray-100 hover:bg-blue-50/40 cursor-pointer'}
          `}
        >
          {/* Checkbox animado */}
          <div className={`
            w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all duration-200
            ${readOnly || (isSelected && complementSelected)
              ? 'bg-gema-blue border-gema-blue'
              : 'border-gray-300 bg-white'}
          `}>
            {(readOnly || (isSelected && complementSelected)) && <span className="text-white text-[8px] font-black leading-none">✓</span>}
            {!readOnly && !isSelected && <LockIcon size={8} className="text-gray-300" />}
          </div>

          <div className="flex-1 text-left min-w-0">
            <span className={`font-semibold ${readOnly ? 'text-emerald-700' : isSelected ? (complementSelected ? 'text-blue-700' : 'text-gray-700') : 'text-gray-400'}`}>
              {complement.name}
            </span>
            {!readOnly && !isSelected && (
              <span className="text-gray-300 text-[10px] block leading-tight mt-0.5">
                {compBlocked ? 'Sin cupo suficiente' : `Toca para activar ${mod.name} + ${complement.name}`}
              </span>
            )}
          </div>

          <span className={`font-bold shrink-0 tabular-nums ${readOnly ? 'text-emerald-600' : isSelected && complementSelected ? 'text-gema-blue' : 'text-gray-400'}`}>
            {mode === 'unlimited'
              ? `${formatCOP(compPrice)}/mes`
              : readOnly || (isSelected && complementSelected)
                ? 'Incluido'
                : compBlocked ? 'Sin cupo' : '1 cupo'}
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
function CartSummary({ items, total, planLabel, termLabel, onCheckout }: {
  items: CartItem[]; total: number; planLabel: string; termLabel: string; onCheckout: () => void;
}) {
  const isEmpty = items.length === 0;
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/60 p-6">
      <div className="flex items-center gap-3 mb-4 pb-5 border-b border-gray-100">
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

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
          {planLabel}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
          {termLabel}
        </span>
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
                {item.note && <span className="text-xs text-gray-400 block mt-0.5 leading-snug">{item.note}</span>}
              </div>
              {item.included ? (
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-300 line-through tabular-nums block">{formatCOP(item.qty * item.price)}</span>
                  <span className="font-bold text-emerald-600">Gratis</span>
                </div>
              ) : (
                <span className="font-bold text-gray-900 shrink-0 tabular-nums">{formatCOP(item.qty * item.price)}</span>
              )}
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
          <span>Continuar</span>
          <ArrowRightIcon size={16} />
        </button>

        {!isEmpty && <p className="text-center text-xs text-gray-400 mt-3">Sin compromiso · Te contactamos en 24 h</p>}
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
type CheckoutStep = 'summary' | 'form' | 'done';

function ModalField({ label, type = 'text', value, onChange, placeholder, required = false }: {
  label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-gema-blue transition-all placeholder:text-gray-400 text-sm font-medium"
      />
    </div>
  );
}

function CheckoutModal({ items, total, planLabel, termLabel, onClose, onFinish }: {
  items: CartItem[]; total: number; planLabel: string; termLabel: string; onClose: () => void; onFinish: () => void;
}) {
  const [modalStep, setModalStep] = useState<CheckoutStep>('summary');
  const [formState, setFormState] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const buildQuoteSummary = () => {
    const lines = items.map(item => {
      const qtyPrefix = item.qty > 1 ? `${item.qty}x ` : '';
      const lineTotal = item.included ? 'Gratis' : formatCOP(item.qty * item.price);
      return `- ${qtyPrefix}${item.label}: ${lineTotal}`;
    });
    return [
      'Cotización armada en la calculadora de precio:',
      `Modalidad: ${planLabel}`,
      `Plazo: ${termLabel}`,
      ...lines,
      `Total mensual: ${formatCOP(total)}`,
    ].join('\n');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const fullMessage = [formState.message.trim(), buildQuoteSummary()].filter(Boolean).join('\n\n');
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          company: formState.company,
          message: fullMessage,
        }),
      });
      if (response.ok) {
        setModalStep('done');
      } else {
        setSubmitError('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setSubmitError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el flujo ya se completó (cotización enviada), cerrar el modal reinicia
  // la calculadora entera; si se cierra antes de terminar, solo se cierra.
  const handleDismiss = () => (modalStep === 'done' ? onFinish() : onClose());

  return (
    // z-[250]: el navbar fijo usa z-200, así que el overlay debe ir por encima para
    // no quedar montado debajo de él cuando el modal crece con muchas selecciones.
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={handleDismiss}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] my-auto flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={handleDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold z-10">
          ✕
        </button>

        {/* Contenido con scroll interno: el modal nunca crece más allá de max-h-[85vh],
            sin importar cuántos ítems haya en la selección. */}
        <div className="overflow-y-auto p-8">
          {modalStep === 'summary' && (
            <>
              <div className="text-center mb-7">
                <div className="w-16 h-16 rounded-2xl bg-gema-blue/10 flex items-center justify-center mx-auto mb-4">
                  <ZapIcon size={28} className="text-gema-blue" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">¡Casi listo!</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Revisa tu selección y continúa para dejarnos tus datos.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{planLabel}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{termLabel}</span>
                </div>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between text-sm gap-3">
                      <div className="min-w-0">
                        <span className="text-gray-600">{item.qty > 1 ? `${item.qty}× ` : ''}{item.label}</span>
                        {item.note && <span className="text-xs text-gray-400 block leading-snug">{item.note}</span>}
                      </div>
                      {item.included ? (
                        <div className="text-right shrink-0">
                          <span className="text-xs text-gray-300 line-through tabular-nums block">{formatCOP(item.qty * item.price)}</span>
                          <span className="font-bold text-emerald-600 text-sm">Gratis</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900 tabular-nums shrink-0">{formatCOP(item.qty * item.price)}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-sm">Total mensual</span>
                  <span className="font-extrabold text-gema-blue text-lg tabular-nums">{formatCOP(total)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalStep('form')}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gema-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span>Continuar</span>
                <ArrowRightIcon size={16} />
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">Sin compromiso · Te contactamos en 24 h</p>
            </>
          )}

          {modalStep === 'form' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Cuéntanos quién eres</h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Con esto y tu selección, un especialista te contactará en menos de 24 horas.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <ModalField
                  label="Nombre completo"
                  placeholder="Ej. Ana García"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  required
                />
                <ModalField
                  label="Fundación / Empresa"
                  placeholder="Ej. Gema Inc."
                  value={formState.company}
                  onChange={e => setFormState({ ...formState, company: e.target.value })}
                />
                <ModalField
                  label="Correo corporativo"
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    ¿Algo más que debamos saber? (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-gema-blue transition-all placeholder:text-gray-400 text-sm font-medium resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{submitError}</p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep('summary')}
                    disabled={isSubmitting}
                    className="px-5 py-3.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all
                      ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gema-gradient hover:opacity-90'}`}
                  >
                    {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar solicitud'}</span>
                    {!isSubmitting && <ArrowRightIcon size={16} />}
                  </button>
                </div>
              </form>
            </>
          )}

          {modalStep === 'done' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckmarkIcon size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">¡Listo!</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed mb-7">
                Recibimos tu solicitud junto con tu selección. Un especialista te contactará en menos de 24 horas.
              </p>
              <button
                type="button"
                onClick={onFinish}
                className="w-full py-3.5 bg-gema-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────
export default function PriceCalculatorPage() {
  const [step, setStep]                   = useState(0);
  const [term, setTerm]                   = useState<Term>('mensual');
  const [modality, setModality]           = useState<ModalityId>('carta');
  const [selectedCores, setSelectedCores] = useState<Set<string>>(new Set());
  const [selectedComps, setSelectedComps] = useState<Set<string>>(new Set());
  const [userUnits, setUserUnits]         = useState(0);
  const [userPacks, setUserPacks]         = useState(0);
  const [companies, setCompanies]         = useState(0);
  const [constructorSelected, setConstructorSelected] = useState(false);
  const [flashingCore, setFlashingCore]   = useState<string | null>(null);
  const [showModal, setShowModal]         = useState(false);

  const containerRef    = useRef<HTMLDivElement>(null);
  const stepContentRef  = useRef<HTMLDivElement>(null);
  const isMounted       = useRef(false);

  // Al terminar el flujo del modal (cotización enviada), la calculadora vuelve a foja cero.
  const resetCalculator = useCallback(() => {
    setShowModal(false);
    setStep(0);
    setTerm('mensual');
    setModality('carta');
    setSelectedCores(new Set());
    setSelectedComps(new Set());
    setUserUnits(0);
    setUserPacks(0);
    setCompanies(0);
    setConstructorSelected(false);
  }, []);

  // ── Cupo según modalidad ─────────────────────────────────────────────────
  const cap: number | 'all' | null = useMemo(() => {
    if (modality === 'arma_medida') return 3;
    if (modality === 'operacion_total') return 'all';
    return null;
  }, [modality]);

  const numericCap = typeof cap === 'number' ? cap : null;
  const cardMode: ModuleCardMode = cap === null ? 'unlimited' : cap === 'all' ? 'readonly' : 'capped';

  // Ajuste de estado durante el render (no efecto) al cambiar de modalidad:
  // reinicia la selección de módulos (evita cupos inválidos).
  const [prevModality, setPrevModality] = useState(modality);
  if (modality !== prevModality) {
    setPrevModality(modality);
    setSelectedCores(new Set());
    setSelectedComps(new Set());
  }

  // ── Navegación entre pasos con fade ──────────────────────────────────────
  const navigateStep = useCallback((next: number) => {
    if (next < 0 || next > STEPS.length - 1) return;
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
      const isSel = prev.has(id);
      if (!isSel && numericCap !== null && prev.size + selectedComps.size >= numericCap) return prev;
      const next = new Set(prev);
      if (isSel) {
        next.delete(id);
        const deps = COMPLEMENTS.filter(c => c.requiresCore === id).map(c => c.id);
        setSelectedComps(p2 => { const n2 = new Set(p2); deps.forEach(d => n2.delete(d)); return n2; });
      } else {
        next.add(id);
      }
      return next;
    });
  }, [numericCap, selectedComps]);

  const toggleComp = useCallback((id: string) => {
    setSelectedComps(prev => {
      const isSel = prev.has(id);
      if (!isSel && numericCap !== null && prev.size + selectedCores.size >= numericCap) return prev;
      const next = new Set(prev);
      if (isSel) next.delete(id); else next.add(id);
      return next;
    });
  }, [numericCap, selectedCores]);

  // Smart activation: complemento bloqueado → activa core + complemento + flash
  const autoActivate = useCallback((coreId: string, compId: string) => {
    if (numericCap !== null && selectedCores.size + selectedComps.size + 2 > numericCap) return;
    setSelectedCores(prev => new Set([...prev, coreId]));
    setSelectedComps(prev  => new Set([...prev, compId]));
    setFlashingCore(coreId);
    setTimeout(() => setFlashingCore(null), 1100);
  }, [numericCap, selectedCores, selectedComps]);

  // ── Selección efectiva (todo incluido cuando es readonly) ────────────────
  const effectiveCores = cardMode === 'readonly' ? ALL_CORE_IDS : selectedCores;
  const effectiveComps  = cardMode === 'readonly' ? ALL_COMP_IDS : selectedComps;
  const moduleCount = effectiveCores.size + effectiveComps.size;

  // ── Precio del plan base (módulos) ───────────────────────────────────────
  const planPrice = useMemo(() => {
    if (cardMode === 'unlimited') return selectedCores.size * CORE_PRICE[term] + selectedComps.size * COMP_PRICE[term];
    if (modality === 'arma_medida') return ARMA_MEDIDA_PRICE[term];
    return OPERACION_TOTAL_PRICE[term];
  }, [cardMode, modality, term, selectedCores.size, selectedComps.size]);

  const planLabel = useMemo(() => {
    if (modality === 'carta') return 'A la Carta';
    if (modality === 'arma_medida') return 'Paquete "Arma tu Medida"';
    return 'Paquete "Operación Total"';
  }, [modality]);

  const termLabel = TERMS.find(t => t.id === term)!.label;

  // ── Totales ──────────────────────────────────────────────────────────────
  const total =
    planPrice +
    userUnits * USER_UNIT_PRICE[term] +
    userPacks * USER_PACK_PRICE[term] +
    companies * COMPANY_PRICE[term] +
    (constructorSelected ? CONSTRUCTOR_PRICE : 0);

  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = [];

    if (cardMode === 'unlimited') {
      Array.from(selectedCores).forEach(id =>
        items.push({ id, label: CORE_MODULES.find(m => m.id === id)!.name, price: CORE_PRICE[term], qty: 1 }));
      Array.from(selectedComps).forEach(id =>
        items.push({ id, label: `${COMPLEMENTS.find(c => c.id === id)!.name} (Complemento)`, price: COMP_PRICE[term], qty: 1 }));
    } else {
      const chosenNames = [
        ...Array.from(effectiveCores).map(id => CORE_MODULES.find(m => m.id === id)!.name),
        ...Array.from(effectiveComps).map(id => COMPLEMENTS.find(c => c.id === id)!.name),
      ];
      items.push({
        id: 'plan',
        label: planLabel,
        price: planPrice,
        qty: 1,
        note: chosenNames.length ? chosenNames.join(', ') : 'Aún no has elegido módulos',
      });
    }

    if (moduleCount > 0) {
      items.push({
        id: 'bonus-users', label: '5 usuarios incluidos', price: USER_PACK_PRICE[term], qty: 1,
        note: 'Incluidos sin costo por tu selección de módulos', included: true,
      });
      items.push({
        id: 'bonus-company', label: '1 compañía incluida', price: COMPANY_PRICE[term], qty: 1,
        note: 'Incluida sin costo por tu selección de módulos', included: true,
      });
    }

    if (userUnits > 0) items.push({ id: 'uu', label: 'Usuarios individuales', price: USER_UNIT_PRICE[term], qty: userUnits });
    if (userPacks > 0) items.push({ id: 'up', label: 'Paquetes × 5 usuarios', price: USER_PACK_PRICE[term], qty: userPacks });
    if (companies > 0) items.push({ id: 'co', label: 'Compañías adicionales', price: COMPANY_PRICE[term], qty: companies });
    if (constructorSelected) {
      items.push({
        id: 'constructor', label: 'Constructor de Ideas', price: CONSTRUCTOR_PRICE, qty: 1,
        note: 'Servicio aparte (no es un módulo) · precio fijo sin importar el plazo',
      });
    }

    return items;
  }, [cardMode, selectedCores, selectedComps, effectiveCores, effectiveComps, moduleCount, planLabel, planPrice, term, userUnits, userPacks, companies, constructorSelected]);

  // ── Animación de entrada ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.page-fade', { opacity: 0, y: 24 });
      gsap.to('.page-fade', { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const infraHeading = useMemo(() => {
    if (cardMode === 'unlimited') return {
      title: 'Tu Infraestructura',
      desc: <>Elige los módulos base de tu operación a <span className="font-semibold text-gray-700">{formatCOP(CORE_PRICE[term])}/mes</span> cada uno. Los complementos aparecen acoplados a su módulo y puedes añadirlos con un clic.</>,
    };
    if (cardMode === 'readonly') return {
      title: 'Tu Infraestructura',
      desc: <>Todos los módulos están incluidos automáticamente en <span className="font-semibold text-gray-700">{planLabel}</span>.</>,
    };
    return {
      title: 'Tu Infraestructura',
      desc: <>Elige hasta <span className="font-semibold text-gray-700">{numericCap} módulo{numericCap === 1 ? '' : 's'}</span> (core o complementarios) incluidos en <span className="font-semibold text-gray-700">{planLabel}</span>.</>,
    };
  }, [cardMode, term, planLabel, numericCap]);

  return (
    <main ref={containerRef} className="bg-white min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-white -z-10" />

      {/* HEADER */}
      <section className="pt-40 pb-10 px-6 text-center relative z-10 page-fade">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
          <ZapIcon size={12} /> Calculadora de Precio
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Arma tu <span className="text-gradient">plan ideal</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
          Configura tu plataforma en 4 pasos. Elige tu modalidad, tu plazo, y solo paga por lo que necesitas.
        </p>
      </section>

      {/* SELECTOR DE PLAZO (global) */}
      <section className="px-6 pb-10 relative z-10 page-fade">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Plazo de contrato</p>
        <TermSelector term={term} onChange={setTerm} />
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── COLUMNA IZQUIERDA ─────────────────── */}
          <div>
            <div className="page-fade">
              <StepIndicator active={step} onGo={navigateStep} />
            </div>

            {/* Contenido del paso */}
            <div ref={stepContentRef} className="page-fade">

              {/* PASO 0: MODALIDAD */}
              {step === 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Modalidad</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Elige el plan base que mejor se ajuste a tu operación. Puedes cambiarlo cuando quieras.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MODALITY_OPTIONS.map(opt => {
                      const price =
                        opt.id === 'carta' ? `Desde ${formatCOP(CORE_PRICE[term])}/mes por módulo`
                        : opt.id === 'arma_medida' ? `${formatCOP(ARMA_MEDIDA_PRICE[term])}/mes`
                        : `${formatCOP(OPERACION_TOTAL_PRICE[term])}/mes`;
                      return (
                        <ModalityCard
                          key={opt.id} opt={opt} active={modality === opt.id} price={price}
                          onSelect={() => setModality(opt.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 1: INFRAESTRUCTURA */}
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">{infraHeading.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{infraHeading.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CORE_MODULES.map(mod => {
                      const comp = COMPLEMENTS.find(c => c.requiresCore === mod.id);
                      const isSelected = effectiveCores.has(mod.id);
                      const compSelected = comp ? effectiveComps.has(comp.id) : false;
                      const coreBlocked = cardMode === 'capped' && !isSelected && numericCap !== null && moduleCount >= numericCap;
                      const compBlocked = cardMode === 'capped' && !!comp && (
                        isSelected
                          ? (!compSelected && numericCap !== null && moduleCount >= numericCap)
                          : (numericCap !== null && moduleCount + 2 > numericCap)
                      );
                      return (
                        <CoreModuleCard
                          key={mod.id}
                          mod={mod}
                          isSelected={isSelected}
                          complement={comp}
                          complementSelected={compSelected}
                          onToggleCore={() => toggleCore(mod.id)}
                          onToggleComplement={() => comp && toggleComp(comp.id)}
                          onAutoActivate={() => comp && autoActivate(mod.id, comp.id)}
                          isFlashing={flashingCore === mod.id}
                          mode={cardMode}
                          corePrice={CORE_PRICE[term]}
                          compPrice={COMP_PRICE[term]}
                          coreBlocked={coreBlocked}
                          compBlocked={compBlocked}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                    {cardMode === 'unlimited' && (selectedCores.size > 0 || selectedComps.size > 0) && (
                      <>
                        {selectedCores.size > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                            {selectedCores.size} módulo{selectedCores.size > 1 ? 's' : ''} core · {formatCOP(selectedCores.size * CORE_PRICE[term])}/mes
                          </span>
                        )}
                        {selectedComps.size > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                            {selectedComps.size} complemento{selectedComps.size > 1 ? 's' : ''} · {formatCOP(selectedComps.size * COMP_PRICE[term])}/mes
                          </span>
                        )}
                      </>
                    )}
                    {cardMode === 'capped' && (
                      <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                        {moduleCount}/{numericCap} módulos seleccionados
                      </span>
                    )}
                    {cardMode === 'readonly' && (
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                        {moduleCount} módulos incluidos · {formatCOP(planPrice)}/mes
                      </span>
                    )}
                  </div>

                  {/* SERVICIO APARTE: no es un módulo, precio fijo independiente del plazo */}
                  <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-200">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[11px] font-bold uppercase tracking-widest mb-3 border border-pink-100">
                      <IdeaIcon size={12} /> Servicio adicional
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-1">Esto no es un módulo</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-2xl">
                      Constructor de Ideas es un servicio de acompañamiento para diseñar y construir procesos a la medida de tu operación. Está disponible sin importar la modalidad que elijas.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setConstructorSelected(v => !v)}
                        className={`w-full flex items-center gap-4 text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                          constructorSelected ? 'border-gema-blue bg-blue-50/30 shadow-lg shadow-blue-100/50' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${constructorSelected ? 'bg-gema-blue/10' : 'bg-pink-50'}`}>
                          <IdeaIcon size={20} className={constructorSelected ? 'text-gema-blue' : 'text-pink-600'} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-gray-900 leading-tight truncate">Constructor de Ideas</h3>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-0.5">Diseña y da vida a procesos a la medida de tu operación.</p>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {constructorSelected && <CheckmarkIcon size={18} className="text-gema-blue" />}
                          <span className={`text-xs font-bold whitespace-nowrap ${constructorSelected ? 'text-gema-blue' : 'text-gray-400'}`}>
                            {formatCOP(CONSTRUCTOR_PRICE)}/mes
                          </span>
                          <span className="text-[10px] text-gray-300 whitespace-nowrap">Precio fijo</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: EQUIPO */}
              {step === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Equipo</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Agrega usuarios individualmente o en paquetes de 5. El paquete te ahorra{' '}
                      <span className="font-semibold text-emerald-600">{formatCOP(5 * USER_UNIT_PRICE[term] - USER_PACK_PRICE[term])}</span>{' '}
                      respecto al precio por unidad.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Counter
                      label="Usuario individual"
                      sublabel="Acceso completo a la plataforma"
                      value={userUnits} price={USER_UNIT_PRICE[term]} unitLabel="usuario" onChange={setUserUnits}
                    />
                    <Counter
                      label="Paquete × 5 usuarios"
                      sublabel={`Ahorra ${formatCOP(5 * USER_UNIT_PRICE[term] - USER_PACK_PRICE[term])} vs. unitario`}
                      value={userPacks} price={USER_PACK_PRICE[term]} unitLabel="paquete" onChange={setUserPacks}
                    />
                  </div>
                  {(userUnits > 0 || userPacks > 0) && (
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{userUnits + userPacks * 5} usuarios</span> en total ·{' '}
                        <span className="font-bold text-gema-blue tabular-nums">{formatCOP(userUnits * USER_UNIT_PRICE[term] + userPacks * USER_PACK_PRICE[term])}/mes</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PASO 3: ORGANIZACIÓN */}
              {step === 3 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Tu Organización</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Cada compañía es una instancia independiente con datos, usuarios y configuración propios.{' '}
                      <span className="font-semibold text-gray-700">{formatCOP(COMPANY_PRICE[term])}/compañía</span>.
                    </p>
                  </div>
                  <div className="max-w-sm">
                    <Counter
                      label="Compañía adicional"
                      sublabel="Instancia de empresa independiente"
                      value={companies} price={COMPANY_PRICE[term]} unitLabel="compañía" onChange={setCompanies}
                    />
                  </div>
                  {companies > 0 && (
                    <div className="mt-4 max-w-sm p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{companies} compañía{companies > 1 ? 's' : ''}</span> ·{' '}
                        <span className="font-bold text-gema-blue tabular-nums">{formatCOP(companies * COMPANY_PRICE[term])}/mes</span>
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

              <button type="button" onClick={() => navigateStep(step + 1)} disabled={step === STEPS.length - 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${step === STEPS.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 bg-gray-50'}`}>
                Siguiente <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>

          {/* ── CARRITO (sticky dentro de los límites de la columna izquierda) ──
              El wrapper exterior NO debe llevar la clase page-fade: GSAP deja un
              transform inline tras la animación, y un transform en un ancestro
              rompe position:sticky en los navegadores. El transform va en el
              propio elemento sticky, donde no afecta su comportamiento. */}
          <div>
            <div className="lg:sticky lg:top-28 page-fade">
              <CartSummary items={cartItems} total={total} planLabel={planLabel} termLabel={termLabel} onCheckout={() => setShowModal(true)} />
            </div>
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

      {showModal && (
        <CheckoutModal
          items={cartItems} total={total} planLabel={planLabel} termLabel={termLabel}
          onClose={() => setShowModal(false)}
          onFinish={resetCalculator}
        />
      )}
    </main>
  );
}
