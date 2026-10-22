import type { CategoryId, PublicProduct } from './types';

export type SortMode = 'default' | 'price-asc' | 'price-desc';

export interface CatalogFilters {
  query: string;
  category: CategoryId | 'all';
  sort: SortMode;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function filterAndSort(products: PublicProduct[], f: CatalogFilters): PublicProduct[] {
  const q = normalize(f.query);
  const terms = q ? q.split(/\s+/) : [];
  const list = products.filter((p) => {
    if (f.category !== 'all' && p.category !== f.category) return false;
    if (!terms.length) return true;
    const haystack = normalize(p.name);
    return terms.every((t) => haystack.includes(t));
  });
  if (f.sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
  if (f.sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
  return list;
}
