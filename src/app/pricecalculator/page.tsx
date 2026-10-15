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
import {
  TERMS, MODALITIES, CORE_MODULES as CORE_CATALOG, COMPLEMENTS, ARMA_MEDIDA_CAP,
  type Term, type ModalityId, type Complement, type PlanSelection,
} from '../../lib/plan-catalog';

// Los precios NO viven en este archivo (llegaría al navegador): el servidor
// calcula la cotización en /api/send a partir de la selección.

// ─── MODALIDAD ───────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODALITY_ICONS: Record<ModalityId, React.ComponentType<any>> = {
  carta: CartIcon, arma_medida: PackageIcon, operacion_total: DiamondIcon,
};
const MODALITY_OPTIONS = MODALITIES.map(m => ({ ...m, icon: MODALITY_ICONS[m.id] }));

// ─── DATA ────────────────────────────────────────────────────────────────────
type CoreModule = {
  id: string; name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string; bg: string; desc: string;
};
interface CartItem { id: string; label: string; qty: number; note?: string; included?: boolean; countable?: boolean; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODULE_VISUALS: Record<string, { icon: React.ComponentType<any>; color: string; bg: string }> = {
  activos:     { icon: PackageIcon,  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  iot:         { icon: WifiIcon,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
  medico:      { icon: ActivityIcon, color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
  cajamenor:   { icon: WalletIcon,   color: 'text-green-600',  bg: 'bg-green-50'  },
  formularios: { icon: FormIcon,     color: 'text-amber-600',  bg: 'bg-amber-50'  },
  dashboards:  { icon: DiamondIcon,  color: 'text-purple-600', bg: 'bg-purple-50' },
  consumibles: { icon: LayersIcon,   color: 'text-orange-600', bg: 'bg-orange-50' },
};

const CORE_MODULES: CoreModule[] = CORE_CATALOG.map(m => ({ ...m, ...MODULE_VISUALS[m.id] }));

const ALL_CORE_IDS = new Set(CORE_MODULES.map(m => m.id));
const ALL_COMP_IDS = new Set(COMPLEMENTS.map(c => c.id));

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
function ModalityCard({ opt, active, onSelect }: {
  opt: typeof MODALITY_OPTIONS[number]; active: boolean; onSelect: () => void;
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
      <p className="text-xs text-gray-500 leading-relaxed">{opt.tagline}</p>
    </button>
  );
}

// ─── CORE MODULE CARD (con complemento acoplado) ─────────────────────────────
type ModuleCardMode = 'unlimited' | 'capped' | 'readonly';

function CoreModuleCard({
  mod, isSelected, complement, complementSelected,
  onToggleCore, onToggleComplement, onAutoActivate, isFlashing,
  mode, coreBlocked, compBlocked,
}: {
  mod: CoreModule; isSelected: boolean;
  complement?: Complement; complementSelected: boolean;
  onToggleCore: () => void; onToggleComplement: () => void;
  onAutoActivate: () => void; isFlashing: boolean;
  mode: ModuleCardMode;
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
              {isSelected ? 'Agregado' : 'Agregar'}
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
              ? (isSelected && complementSelected ? 'Agregado' : 'Agregar')
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
function Counter({ label, sublabel, value, onChange }: {
  label: string; sublabel?: string; value: number; onChange: (v: number) => void;
}) {
  const active = value > 0;
  return (
    <div className={`rounded-2xl border-2 p-5 transition-all duration-200 ${active ? 'border-gema-blue bg-blue-50/30 shadow-lg shadow-blue-100/50' : 'border-gray-200 bg-white'}`}>
      <div className="mb-5">
        <p className="font-bold text-sm text-gray-900">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{sublabel}</p>}
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
      </div>
    </div>
  );
}

// ─── CARRITO ─────────────────────────────────────────────────────────────────
function CartSummary({ items, planLabel, termLabel, onCheckout }: {
  items: CartItem[]; planLabel: string; termLabel: string; onCheckout: () => void;
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
                {item.note && <span className="text-xs text-gray-400 block mt-0.5 leading-snug">{item.note}</span>}
              </div>
              {item.included ? (
                <span className="font-bold text-emerald-600 shrink-0">Gratis</span>
              ) : (item.countable || item.qty > 1) && (
                <span className="font-bold text-gray-900 shrink-0 tabular-nums">× {item.qty}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className={`pt-5 border-t border-gray-100 ${isEmpty ? 'opacity-40' : ''}`}>
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-900">Cotización personalizada</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Envíanos tu selección y un especialista te compartirá el valor de tu plan.
          </p>
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

function CheckoutModal({ items, selection, planLabel, termLabel, onClose, onFinish }: {
  items: CartItem[]; selection: PlanSelection; planLabel: string; termLabel: string; onClose: () => void; onFinish: () => void;
}) {
  const [modalStep, setModalStep] = useState<CheckoutStep>('summary');
  const [formState, setFormState] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Solo se envía la selección: el servidor calcula los valores y arma la
      // cotización para el correo interno.
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          company: formState.company,
          message: formState.message,
          plan: selection,
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
    // data-lenis-prevent: Lenis (smooth scroll global) intercepta la rueda del mouse;
    // sin esto, la lista con scroll interno del modal no responde a la rueda.
    <div data-lenis-prevent className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={handleDismiss}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] my-auto flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={handleDismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold z-10">
          ✕
        </button>

        {/* El modal nunca crece más allá de max-h-[85vh]. En el resumen, el scroll vive
            solo en la lista de ítems, así el botón "Continuar" siempre queda visible. */}
        <div className={`p-8 min-h-0 ${modalStep === 'summary' ? 'flex flex-col' : 'overflow-y-auto'}`}>
          {modalStep === 'summary' && (
            <>
              <div className="text-center mb-7 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gema-blue/10 flex items-center justify-center mx-auto mb-4">
                  <ZapIcon size={28} className="text-gema-blue" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">¡Casi listo!</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Revisa tu selección y continúa para dejarnos tus datos.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 flex flex-col min-h-0">
                <div className="flex flex-wrap gap-2 mb-4 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{planLabel}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{termLabel}</span>
                </div>
                <ul className="space-y-2.5 min-h-16 overflow-y-auto overscroll-contain pr-1 -mr-1">
                  {items.map(item => (
                    <li key={item.id} className="flex justify-between text-sm gap-3">
                      <div className="min-w-0">
                        <span className="text-gray-600">{item.countable || item.qty > 1 ? `${item.qty}× ` : ''}{item.label}</span>
                        {item.note && <span className="text-xs text-gray-400 block leading-snug">{item.note}</span>}
                      </div>
                      {item.included && <span className="font-bold text-emerald-600 text-sm shrink-0">Gratis</span>}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-gray-200 mt-4 pt-4 text-xs text-gray-500 leading-relaxed shrink-0">
                  Un especialista te enviará la cotización con el valor de tu plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalStep('form')}
                className="shrink-0 flex items-center justify-center gap-2 w-full py-3.5 bg-gema-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span>Continuar</span>
                <ArrowRightIcon size={16} />
              </button>
              <p className="shrink-0 text-center text-xs text-gray-400 mt-4">Sin compromiso · Te contactamos en 24 h</p>
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
    if (modality === 'arma_medida') return ARMA_MEDIDA_CAP;
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

  const planLabel = MODALITIES.find(m => m.id === modality)!.label;
  const termLabel = TERMS.find(t => t.id === term)!.label;

  // Lo que se envía al servidor para cotizar (sin precios).
  const selection: PlanSelection = {
    term, modality,
    cores: Array.from(effectiveCores),
    comps: Array.from(effectiveComps),
    userUnits, userPacks, companies,
    constructorIdeas: constructorSelected,
  };

  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = [];

    if (cardMode === 'unlimited') {
      Array.from(selectedCores).forEach(id =>
        items.push({ id, label: CORE_MODULES.find(m => m.id === id)!.name, qty: 1 }));
      Array.from(selectedComps).forEach(id =>
        items.push({ id, label: `${COMPLEMENTS.find(c => c.id === id)!.name} (Complemento)`, qty: 1 }));
    } else {
      const chosenNames = [
        ...Array.from(effectiveCores).map(id => CORE_MODULES.find(m => m.id === id)!.name),
        ...Array.from(effectiveComps).map(id => COMPLEMENTS.find(c => c.id === id)!.name),
      ];
      items.push({
        id: 'plan',
        label: planLabel,
        qty: 1,
        note: chosenNames.length ? chosenNames.join(', ') : 'Aún no has elegido módulos',
      });
    }

    if (moduleCount > 0) {
      items.push({
        id: 'bonus-users', label: '5 usuarios incluidos', qty: 1,
        note: 'Incluidos sin costo por tu selección de módulos', included: true,
      });
      items.push({
        id: 'bonus-company', label: '1 compañía incluida', qty: 1,
        note: 'Incluida sin costo por tu selección de módulos', included: true,
      });
    }

    if (userUnits > 0) items.push({ id: 'uu', label: 'Usuarios individuales', qty: userUnits, countable: true });
    if (userPacks > 0) items.push({ id: 'up', label: 'Paquetes × 5 usuarios', qty: userPacks, countable: true });
    if (companies > 0) items.push({ id: 'co', label: 'Compañías adicionales', qty: companies, countable: true });
    if (constructorSelected) {
      items.push({
        id: 'constructor', label: 'Constructor de Ideas', qty: 1,
        note: 'Servicio aparte (no es un módulo) · precio fijo sin importar el plazo',
      });
    }

    return items;
  }, [cardMode, selectedCores, selectedComps, effectiveCores, effectiveComps, moduleCount, planLabel, userUnits, userPacks, companies, constructorSelected]);

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
      desc: <>Elige los módulos base de tu operación. Los complementos aparecen acoplados a su módulo y puedes añadirlos con un clic.</>,
    };
    if (cardMode === 'readonly') return {
      title: 'Tu Infraestructura',
      desc: <>Todos los módulos están incluidos automáticamente en <span className="font-semibold text-gray-700">{planLabel}</span>.</>,
    };
    return {
      title: 'Tu Infraestructura',
      desc: <>Elige hasta <span className="font-semibold text-gray-700">{numericCap} módulo{numericCap === 1 ? '' : 's'}</span> (core o complementarios) incluidos en <span className="font-semibold text-gray-700">{planLabel}</span>.</>,
    };
  }, [cardMode, planLabel, numericCap]);

  return (
    <main ref={containerRef} className="bg-white min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-white -z-10" />

      {/* HEADER */}
      <section className="pt-40 pb-10 px-6 text-center relative z-10 page-fade">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
          <ZapIcon size={12} /> Configurador de Plan
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
                    {MODALITY_OPTIONS.map(opt => (
                      <ModalityCard
                        key={opt.id} opt={opt} active={modality === opt.id}
                        onSelect={() => setModality(opt.id)}
                      />
                    ))}
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
                            {selectedCores.size} módulo{selectedCores.size > 1 ? 's' : ''} core
                          </span>
                        )}
                        {selectedComps.size > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                            {selectedComps.size} complemento{selectedComps.size > 1 ? 's' : ''}
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
                        {moduleCount} módulos incluidos
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
                            {constructorSelected ? 'Agregado' : 'Agregar'}
                          </span>
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
                      Agrega usuarios individualmente o en paquetes de 5. El paquete tiene{' '}
                      <span className="font-semibold text-emerald-600">mejor precio</span>{' '}
                      que agregar 5 usuarios por separado.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Counter
                      label="Usuario individual"
                      sublabel="Acceso completo a la plataforma"
                      value={userUnits} onChange={setUserUnits}
                    />
                    <Counter
                      label="Paquete × 5 usuarios"
                      sublabel="Ahorra frente a 5 usuarios individuales"
                      value={userPacks} onChange={setUserPacks}
                    />
                  </div>
                  {(userUnits > 0 || userPacks > 0) && (
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{userUnits + userPacks * 5} usuarios</span> adicionales en total
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
                      Cada compañía es una instancia independiente con datos, usuarios y configuración propios.
                    </p>
                  </div>
                  <div className="max-w-sm">
                    <Counter
                      label="Compañía adicional"
                      sublabel="Instancia de empresa independiente"
                      value={companies} onChange={setCompanies}
                    />
                  </div>
                  {companies > 0 && (
                    <div className="mt-4 max-w-sm p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{companies} compañía{companies > 1 ? 's' : ''}</span> adicional{companies > 1 ? 'es' : ''}
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
              <CartSummary items={cartItems} planLabel={planLabel} termLabel={termLabel} onCheckout={() => setShowModal(true)} />
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
              <p className="font-extrabold text-gray-900 text-sm leading-tight">{planLabel}</p>
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
          items={cartItems} selection={selection} planLabel={planLabel} termLabel={termLabel}
          onClose={() => setShowModal(false)}
          onFinish={resetCalculator}
        />
      )}
    </main>
  );
}
