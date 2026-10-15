// Catálogo del configurador de planes, compartido entre cliente y servidor.
// IMPORTANTE: este archivo llega al navegador — NO debe contener precios.
// Los valores viven solo en `pricing.ts`, que únicamente importa la API.

export type Term = 'mensual' | '3m' | '6m' | '12m';

export const TERMS: { id: Term; label: string; shortLabel: string }[] = [
  { id: 'mensual', label: 'Mes a mes',          shortLabel: 'Mensual'  },
  { id: '3m',      label: 'Contrato 3 Meses',   shortLabel: '3 meses'  },
  { id: '6m',      label: 'Contrato 6 Meses',   shortLabel: '6 meses'  },
  { id: '12m',     label: 'Contrato 12 Meses',  shortLabel: '12 meses' },
];

export type ModalityId = 'carta' | 'arma_medida' | 'operacion_total';

export const MODALITIES: { id: ModalityId; name: string; label: string; tagline: string }[] = [
  { id: 'carta',           name: 'A la Carta',      label: 'A la Carta',                  tagline: 'Elige tus módulos uno por uno.' },
  { id: 'arma_medida',     name: 'Arma tu Medida',  label: 'Paquete "Arma tu Medida"',    tagline: 'Elige exactamente 3 módulos por un precio fijo.' },
  { id: 'operacion_total', name: 'Operación Total', label: 'Paquete "Operación Total"',   tagline: 'Todos los módulos incluidos, sin elegir nada.' },
];

/** Cupo de módulos (core + complementos) para la modalidad "Arma tu Medida". */
export const ARMA_MEDIDA_CAP = 3;

export const CORE_MODULES: { id: string; name: string; desc: string }[] = [
  { id: 'activos',     name: 'Activos Fijos',             desc: 'Control y trazabilidad de tu patrimonio.' },
  { id: 'iot',         name: 'IoT & Sensores',            desc: 'Monitoreo en tiempo real de equipos y sensores.' },
  { id: 'medico',      name: 'Gestión Médica',            desc: 'Salud ocupacional integrada para tus colaboradores.' },
  { id: 'cajamenor',   name: 'Caja Menor',                desc: 'Control automatizado de gastos menores y reembolsos.' },
  { id: 'formularios', name: 'Formularios',               desc: 'Digitaliza procesos y flujos de trabajo sin código.' },
  { id: 'dashboards',  name: 'Dashboards',                desc: 'Indicadores clave y reportes en tiempo real.' },
  { id: 'consumibles', name: 'Inventario de Consumibles', desc: 'Gestión de stock, EPPs e insumos de alta rotación.' },
];

export type Complement = { id: string; name: string; requiresCore: string; desc: string };

export const COMPLEMENTS: Complement[] = [
  { id: 'movimientos',     name: 'Movimientos',        requiresCore: 'activos',     desc: 'Traslados y bajas de activos.' },
  { id: 'procesos-compra', name: 'Procesos de Compra', requiresCore: 'consumibles', desc: 'Requisición y órdenes de compra.' },
];

/** Selección que el navegador envía a /api/send. El servidor la valida y le pone precio. */
export interface PlanSelection {
  term: Term;
  modality: ModalityId;
  cores: string[];
  comps: string[];
  userUnits: number;
  userPacks: number;
  companies: number;
  constructorIdeas: boolean;
}
