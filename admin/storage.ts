import seed from '../data/products.private.json';
import type { CategoryId, Language, PrivateCatalogFile, PrivateProduct, ProductStatus } from '../src/lib/types';

const KEY = 'series2-admin:catalog:v1';

export const seedCatalog = seed as PrivateCatalogFile;

export function loadCatalog(): PrivateCatalogFile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return validateCatalog(JSON.parse(raw));
  } catch {
    /* datos corruptos: se usa el archivo de datos */
  }
  return structuredClone(seedCatalog);
}

export function saveCatalog(c: PrivateCatalogFile): void {
  localStorage.setItem(KEY, JSON.stringify(c));
}

export function clearSaved(): void {
  localStorage.removeItem(KEY);
}

const CATEGORIES: CategoryId[] = ['etb', 'booster-bundle', 'booster-box', 'otros'];
const STATUSES: ProductStatus[] = ['available', 'soldout', 'hidden'];
const LANGS: Language[] = ['en', 'es'];

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);

/** Valida un JSON importado. Lanza Error con mensaje en español si es inválido. */
export function validateCatalog(data: unknown): PrivateCatalogFile {
  if (!data || typeof data !== 'object' || !Array.isArray((data as PrivateCatalogFile).products)) {
    throw new Error('El archivo no tiene el formato esperado (falta "products").');
  }
  const seen = new Set<string>();
  const products = (data as PrivateCatalogFile).products.map((p, i): PrivateProduct => {
    const where = `Producto #${i + 1}`;
    if (!p || typeof p !== 'object') throw new Error(`${where}: formato inválido.`);
    if (typeof p.id !== 'string' || !p.id) throw new Error(`${where}: falta "id".`);
    if (seen.has(p.id)) throw new Error(`${where}: id repetido "${p.id}".`);
    seen.add(p.id);
    if (typeof p.name !== 'string' || !p.name.trim()) throw new Error(`${where}: falta "name".`);
    const cost = num(p.cost);
    const price = num(p.price);
    if (cost === null) throw new Error(`${p.name}: "cost" debe ser un número ≥ 0.`);
    if (price === null) throw new Error(`${p.name}: "price" debe ser un número ≥ 0.`);
    if (!CATEGORIES.includes(p.category)) throw new Error(`${p.name}: categoría inválida.`);
    if (!STATUSES.includes(p.status)) throw new Error(`${p.name}: estado inválido.`);
    return {
      id: p.id,
      name: p.name.trim(),
      description: typeof p.description === 'string' ? p.description : '',
      category: p.category,
      language: LANGS.includes(p.language) ? p.language : 'en',
      condition: 'sealed',
      cost,
      ...(p.costApproximate ? { costApproximate: true } : {}),
      price,
      minPrice: p.minPrice == null ? null : num(p.minPrice),
      stock: p.stock == null ? null : Number.isInteger(p.stock) && p.stock >= 0 ? p.stock : null,
      image: typeof p.image === 'string' && p.image.trim() ? p.image.trim() : null,
      status: p.status,
    };
  });
  return { version: 1, products };
}

export function download(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
