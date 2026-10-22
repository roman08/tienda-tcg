import { useMemo, useState } from 'react';
import type { CategoryId, PublicProduct } from '../lib/types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/categories';
import { filterAndSort, type SortMode } from '../lib/catalog';
import { ProductCard } from './ProductCard';

export function Catalog({ products, phone }: { products: PublicProduct[]; phone: string | null }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('default');

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c)),
    [products],
  );
  const visible = useMemo(() => filterAndSort(products, { query, category, sort }), [products, query, category, sort]);
  const hasFilters = query !== '' || category !== 'all' || sort !== 'default';

  function reset() {
    setQuery('');
    setCategory('all');
    setSort('default');
  }

  return (
    <section id="catalogo" className="section" aria-labelledby="catalogo-title">
      <div className="container">
        <h2 id="catalogo-title">Catálogo</h2>
        <p className="section-sub">Precios en MXN. Sujetos a disponibilidad: consulta antes de comprar.</p>

        <div className="controls" role="search">
          <div className="field field-search">
            <label htmlFor="q">Buscar por nombre</label>
            <input
              id="q"
              type="search"
              placeholder="Ej. ETB Prismatic"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="cat">Tipo de producto</label>
            <select id="cat" value={category} onChange={(e) => setCategory(e.target.value as CategoryId | 'all')}>
              <option value="all">Todos</option>
              {categories.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Ordenar por</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
              <option value="default">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <p className="result-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'producto' : 'productos'}
        </p>

        {products.length === 0 ? (
          <div className="empty">
            <p>El catálogo se está actualizando. Vuelve pronto.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty">
            <p>No encontramos productos con esos filtros.</p>
            {hasFilters && (
              <button type="button" className="btn btn-ghost btn-md" onClick={reset}>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <ul className="grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} phone={phone} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
