import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { calcProfit } from '../src/lib/profit';
import { isAvailable, toPublicProducts } from '../src/lib/publicize';
import { filterAndSort } from '../src/lib/catalog';
import type { PrivateCatalogFile, PublicCatalogFile } from '../src/lib/types';

const hasPrivate = existsSync('data/products.private.json');
const priv: PrivateCatalogFile = hasPrivate
  ? (JSON.parse(readFileSync('data/products.private.json', 'utf8')) as PrivateCatalogFile)
  : { version: 1, products: [] };
const pub = JSON.parse(readFileSync('src/data/catalog.public.json', 'utf8')) as PublicCatalogFile;

const EXPECTED: Array<[string, number, number]> = [
  ['Series 2', 900, 1100],
  ['Series 3', 950, 1200],
  ['ETB Chaos Rising', 1300, 1600],
  ['ETB Perfect Order', 1200, 1500],
  ['ETB Ascended Heroes', 2800, 3400],
  ['ETB 151', 10000, 12000],
  ['ETB Pitch Black', 1500, 1850],
  ['ETB Phantasmal Flames', 2900, 3500],
  ['ETB Mega Evolution Gardevoir', 2500, 3000],
  ['ETB Mega Evolution Mega Lucario', 2500, 3000],
  ['ETB Black Bolt', 2700, 3250],
  ['ETB White Flare', 2700, 3250],
  ['ETB Temporal Forces', 2900, 3500],
  ['ETB Silver Tempest', 4000, 4800],
  ['ETB Masquerade', 3100, 3750],
  ['ETB Prismatic Evolutions', 2900, 3500],
  ['ETB Paradox Rift', 2800, 3400],
  ['ETB Obsidian Flames', 9000, 10800],
  ['ETB Stellar Crown', 2900, 3500],
  ['ETB Journey Together', 2200, 2650],
  ['Booster Bundle Ascended Heroes', 1300, 1600],
  ['Booster Box Pitch Black', 3500, 4200],
  ['Booster Bundle Destined Rivals', 1500, 1800],
];

describe.skipIf(!hasPrivate)('datos iniciales', () => {
  it('tienen exactamente 23 productos con ids únicos', () => {
    expect(priv.products).toHaveLength(23);
    expect(new Set(priv.products.map((p) => p.id)).size).toBe(23);
  });

  it('coinciden con la tabla (nombre, costo y precio)', () => {
    expect(priv.products.map((p) => [p.name, p.cost, p.price])).toEqual(EXPECTED);
  });

  it('todos son en inglés y sellados', () => {
    for (const p of priv.products) {
      expect(p.language).toBe('en');
      expect(p.condition).toBe('sealed');
    }
  });

  it('todos tienen ganancia positiva calculada', () => {
    for (const p of priv.products) expect(calcProfit(p.cost, p.price).profitCents).toBeGreaterThan(0);
  });

  it('el JSON público está sincronizado con el privado', () => {
    expect(pub.products).toEqual(toPublicProducts(priv.products));
  });
});

describe.skipIf(!hasPrivate)('separación público / privado', () => {
  it('el JSON público no contiene campos privados', () => {
    const text = JSON.stringify(pub);
    for (const key of ['cost', 'minPrice', 'stock', 'costApproximate']) {
      expect(text).not.toContain(`"${key}"`);
    }
  });

  it('ocultos no se publican; agotados se marcan no disponibles', () => {
    const base = priv.products[0];
    const out = toPublicProducts([
      { ...base, id: 'a', status: 'hidden' },
      { ...base, id: 'b', status: 'soldout' },
      { ...base, id: 'c', status: 'available', stock: 0 },
      { ...base, id: 'd', status: 'available', stock: 3 },
      { ...base, id: 'e', status: 'available', stock: null },
    ]);
    expect(out.map((p) => [p.id, p.available])).toEqual([
      ['b', false],
      ['c', false],
      ['d', true],
      ['e', true],
    ]);
    expect(isAvailable({ status: 'available', stock: 0 })).toBe(false);
  });
});

describe('buscador, filtros y orden', () => {
  it('busca sin distinguir mayúsculas ni acentos', () => {
    const r = filterAndSort(pub.products, { query: 'pitch BLACK', category: 'all', sort: 'default' });
    expect(r.map((p) => p.name).sort()).toEqual(['Booster Box Pitch Black', 'ETB Pitch Black']);
  });
  it('filtra por tipo', () => {
    const r = filterAndSort(pub.products, { query: '', category: 'booster-bundle', sort: 'default' });
    expect(r).toHaveLength(2);
  });
  it('ordena por precio', () => {
    const asc = filterAndSort(pub.products, { query: '', category: 'all', sort: 'price-asc' });
    const desc = filterAndSort(pub.products, { query: '', category: 'all', sort: 'price-desc' });
    expect(asc[0].name).toBe('Series 2');
    expect(desc[0].name).toBe('ETB 151');
  });
});
