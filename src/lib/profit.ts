/**
 * Cálculos de ganancia en aritmética entera (centavos) para evitar errores
 * de punto flotante. Son márgenes BRUTOS por unidad: no incluyen impuestos,
 * comisiones, envíos, publicidad ni otros gastos.
 */

export interface ProfitResult {
  /** Ganancia bruta por unidad, en centavos. */
  profitCents: number;
  /** Ganancia bruta por unidad, en pesos (2 decimales exactos). */
  profit: number;
  /** Margen bruto % = ganancia / precio de venta × 100 (2 decimales). null si el precio es 0. */
  marginPct: number | null;
  /** Recargo sobre costo % = ganancia / costo × 100 (2 decimales). null si el costo es 0. */
  markupPct: number | null;
}

export function toCents(pesos: number): number {
  if (!Number.isFinite(pesos)) throw new Error('Monto inválido');
  return Math.round(pesos * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

/** Porcentaje con 2 decimales usando solo enteros: round(num * 10000 / den) / 100. */
function pct(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator * 10000) / denominator) / 100;
}

export function calcProfit(costPesos: number, pricePesos: number): ProfitResult {
  const costC = toCents(costPesos);
  const priceC = toCents(pricePesos);
  const profitCents = priceC - costC;
  return {
    profitCents,
    profit: fromCents(profitCents),
    marginPct: pct(profitCents, priceC),
    markupPct: pct(profitCents, costC),
  };
}

export function formatPct(value: number | null): string {
  return value === null ? '—' : `${value.toFixed(2)} %`;
}
