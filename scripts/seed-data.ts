/**
 * Genera data/products.private.json con los 23 productos iniciales.
 * Uso (solo la primera vez): npx tsx scripts/seed-data.ts
 * Después, edita data/products.private.json (o usa la herramienta de administración local).
 */
import { writeFileSync, existsSync } from 'node:fs';
import type { CategoryId, PrivateCatalogFile, PrivateProduct } from '../src/lib/types';

type Row = [name: string, category: CategoryId, cost: number, price: number, approx?: boolean];

const rows: Row[] = [
  ['Series 2', 'otros', 900, 1100],
  ['Series 3', 'otros', 950, 1200],
  ['ETB Chaos Rising', 'etb', 1300, 1600],
  ['ETB Perfect Order', 'etb', 1200, 1500],
  ['ETB Ascended Heroes', 'etb', 2800, 3400],
  ['ETB 151', 'etb', 10000, 12000, true],
  ['ETB Pitch Black', 'etb', 1500, 1850],
  ['ETB Phantasmal Flames', 'etb', 2900, 3500],
  ['ETB Mega Evolution Gardevoir', 'etb', 2500, 3000],
  ['ETB Mega Evolution Mega Lucario', 'etb', 2500, 3000],
  ['ETB Black Bolt', 'etb', 2700, 3250],
  ['ETB White Flare', 'etb', 2700, 3250],
  ['ETB Temporal Forces', 'etb', 2900, 3500],
  ['ETB Silver Tempest', 'etb', 4000, 4800],
  ['ETB Masquerade', 'etb', 3100, 3750],
  ['ETB Prismatic Evolutions', 'etb', 2900, 3500],
  ['ETB Paradox Rift', 'etb', 2800, 3400],
  ['ETB Obsidian Flames', 'etb', 9000, 10800, true],
  ['ETB Stellar Crown', 'etb', 2900, 3500],
  ['ETB Journey Together', 'etb', 2200, 2650],
  ['Booster Bundle Ascended Heroes', 'booster-bundle', 1300, 1600],
  ['Booster Box Pitch Black', 'booster-box', 3500, 4200],
  ['Booster Bundle Destined Rivals', 'booster-bundle', 1500, 1800],
];

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const products: PrivateProduct[] = rows.map(([name, category, cost, price, approx]) => ({
  id: slug(name),
  name,
  description: '',
  category,
  language: 'en',
  condition: 'sealed',
  cost,
  ...(approx ? { costApproximate: true } : {}),
  price,
  minPrice: null,
  stock: null,
  image: null,
  status: 'available',
}));

const file: PrivateCatalogFile = { version: 1, products };
const out = 'data/products.private.json';
if (existsSync(out) && !process.argv.includes('--force')) {
  console.error(`${out} ya existe. Usa --force para sobrescribirlo.`);
  process.exit(1);
}
writeFileSync(out, JSON.stringify(file, null, 2) + '\n');
console.log(`Escrito ${out} con ${products.length} productos.`);
