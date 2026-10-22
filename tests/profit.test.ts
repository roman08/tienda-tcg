import { describe, expect, it } from 'vitest';
import { calcProfit, toCents } from '../src/lib/profit';

describe('calcProfit', () => {
  it('Series 2: costo 900, venta 1100', () => {
    const r = calcProfit(900, 1100);
    expect(r.profit).toBe(200);
    expect(r.marginPct).toBe(18.18); // 200/1100
    expect(r.markupPct).toBe(22.22); // 200/900
  });

  it('ETB 151: costo 10000, venta 12000', () => {
    const r = calcProfit(10000, 12000);
    expect(r.profit).toBe(2000);
    expect(r.marginPct).toBe(16.67);
    expect(r.markupPct).toBe(20);
  });

  it('ETB Pitch Black: costo 1500, venta 1850', () => {
    const r = calcProfit(1500, 1850);
    expect(r.profit).toBe(350);
    expect(r.marginPct).toBe(18.92);
    expect(r.markupPct).toBe(23.33);
  });

  it('evita errores de punto flotante en montos con centavos', () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    const r = calcProfit(19.99, 29.99);
    expect(r.profitCents).toBe(1000);
    expect(r.profit).toBe(10);
  });

  it('admite pérdidas (ganancia negativa)', () => {
    const r = calcProfit(1000, 900);
    expect(r.profit).toBe(-100);
    expect(r.marginPct).toBe(-11.11);
    expect(r.markupPct).toBe(-10);
  });

  it('devuelve null en porcentajes con divisor cero', () => {
    expect(calcProfit(0, 100).markupPct).toBeNull();
    expect(calcProfit(100, 0).marginPct).toBeNull();
  });

  it('rechaza montos no finitos', () => {
    expect(() => calcProfit(NaN, 100)).toThrow();
  });
});
