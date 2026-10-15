// Precios del configurador de planes. SOLO SERVIDOR: no importar desde
// componentes 'use client', o los valores terminarán en el bundle del navegador.
import {
  TERMS, MODALITIES, CORE_MODULES, COMPLEMENTS, ARMA_MEDIDA_CAP,
  type Term, type ModalityId, type PlanSelection,
} from './plan-catalog';

const CORE_PRICE: Record<Term, number> = { mensual: 89_000, '3m': 84_000, '6m': 78_000, '12m': 70_000 };
const COMP_PRICE: Record<Term, number> = { mensual: 35_000, '3m': 33_000, '6m': 30_000, '12m': 28_000 };

const ARMA_MEDIDA_PRICE: Record<Term, number>     = { mensual: 139_000, '3m': 132_000, '6m': 122_000, '12m': 110_000 };
const OPERACION_TOTAL_PRICE: Record<Term, number> = { mensual: 189_000, '3m': 179_000, '6m': 165_000, '12m': 150_000 };

const COMPANY_PRICE: Record<Term, number>   = { mensual: 39_000, '3m': 37_000, '6m': 34_000, '12m': 30_000 };
const USER_UNIT_PRICE: Record<Term, number> = { mensual: 11_000, '3m': 9_000,  '6m': 8_000,  '12m': 7_000  };
const USER_PACK_PRICE: Record<Term, number> = { mensual: 35_000, '3m': 29_000, '6m': 25_000, '12m': 19_000 };

// Constructor de Ideas: servicio aparte, precio fijo que no varía según el plazo.
const CONSTRUCTOR_PRICE = 79_000;

const MAX_QTY = 1000;

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const isQty = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= MAX_QTY;
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');

/** Valida la selección recibida del navegador. Devuelve null si es inválida. */
export function parsePlanSelection(raw: unknown): PlanSelection | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;

  if (!TERMS.some(t => t.id === s.term)) return null;
  if (!MODALITIES.some(m => m.id === s.modality)) return null;
  if (!isStringArray(s.cores) || !isStringArray(s.comps)) return null;
  if (!isQty(s.userUnits) || !isQty(s.userPacks) || !isQty(s.companies)) return null;
  if (typeof s.constructorIdeas !== 'boolean') return null;

  const cores = [...new Set(s.cores)];
  const comps = [...new Set(s.comps)];
  if (!cores.every(id => CORE_MODULES.some(m => m.id === id))) return null;
  // Un complemento solo es válido si su módulo core también está seleccionado.
  if (!comps.every(id => {
    const c = COMPLEMENTS.find(x => x.id === id);
    return !!c && cores.includes(c.requiresCore);
  })) return null;

  const modality = s.modality as ModalityId;
  if (modality === 'arma_medida' && cores.length + comps.length > ARMA_MEDIDA_CAP) return null;

  return {
    term: s.term as Term,
    modality,
    // En "Operación Total" todo va incluido, sin importar lo que llegue.
    cores: modality === 'operacion_total' ? CORE_MODULES.map(m => m.id) : cores,
    comps: modality === 'operacion_total' ? COMPLEMENTS.map(c => c.id) : comps,
    userUnits: s.userUnits as number,
    userPacks: s.userPacks as number,
    companies: s.companies as number,
    constructorIdeas: s.constructorIdeas as boolean,
  };
}

/** Resumen con precios para el correo interno de BPF. Nunca se envía al cliente. */
export function buildPricedQuoteSummary(sel: PlanSelection): string {
  const { term } = sel;
  const coreName = (id: string) => CORE_MODULES.find(m => m.id === id)!.name;
  const compName = (id: string) => COMPLEMENTS.find(c => c.id === id)!.name;
  const lines: string[] = [];
  let total = 0;

  const add = (label: string, unitPrice: number, qty = 1) => {
    const lineTotal = unitPrice * qty;
    total += lineTotal;
    lines.push(`- ${qty > 1 ? `${qty}x ` : ''}${label}: ${formatCOP(lineTotal)}`);
  };

  if (sel.modality === 'carta') {
    sel.cores.forEach(id => add(coreName(id), CORE_PRICE[term]));
    sel.comps.forEach(id => add(`${compName(id)} (Complemento)`, COMP_PRICE[term]));
  } else {
    const planPrice = sel.modality === 'arma_medida' ? ARMA_MEDIDA_PRICE[term] : OPERACION_TOTAL_PRICE[term];
    const chosen = [...sel.cores.map(coreName), ...sel.comps.map(compName)];
    const planLabel = MODALITIES.find(m => m.id === sel.modality)!.label;
    add(`${planLabel} (${chosen.length ? chosen.join(', ') : 'sin módulos elegidos'})`, planPrice);
  }

  if (sel.cores.length + sel.comps.length > 0) {
    lines.push('- 5 usuarios incluidos: Gratis');
    lines.push('- 1 compañía incluida: Gratis');
  }

  if (sel.userUnits > 0) add('Usuarios individuales', USER_UNIT_PRICE[term], sel.userUnits);
  if (sel.userPacks > 0) add('Paquetes × 5 usuarios', USER_PACK_PRICE[term], sel.userPacks);
  if (sel.companies > 0) add('Compañías adicionales', COMPANY_PRICE[term], sel.companies);
  if (sel.constructorIdeas) add('Constructor de Ideas (precio fijo)', CONSTRUCTOR_PRICE);

  return [
    'Cotización armada en la calculadora de precio:',
    `Modalidad: ${MODALITIES.find(m => m.id === sel.modality)!.label}`,
    `Plazo: ${TERMS.find(t => t.id === sel.term)!.label}`,
    ...lines,
    `Total mensual: ${formatCOP(total)}`,
  ].join('\n');
}
