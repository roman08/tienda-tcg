import { useEffect, useMemo, useRef, useState } from 'react';
import type { CategoryId, Language, PrivateCatalogFile, PrivateProduct, ProductStatus } from '../src/lib/types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../src/lib/categories';
import { calcProfit, formatPct } from '../src/lib/profit';
import { toPublicProducts } from '../src/lib/publicize';
import { formatMoney } from '../src/lib/format';
import { clearSaved, download, loadCatalog, saveCatalog, seedCatalog, validateCatalog } from './storage';

const STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Disponible',
  soldout: 'Agotado',
  hidden: 'Oculto',
};

function newProduct(): PrivateProduct {
  return {
    id: `nuevo-${Date.now().toString(36)}`,
    name: 'Nuevo producto',
    description: '',
    category: 'otros',
    language: 'es',
    condition: 'sealed',
    cost: 0,
    price: 0,
    minPrice: null,
    stock: null,
    image: null,
    status: 'hidden',
  };
}

export function AdminApp() {
  const [catalog, setCatalog] = useState<PrivateCatalogFile>(loadCatalog);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveCatalog(catalog);
  }, [catalog]);

  const totals = useMemo(() => {
    const priced = catalog.products.filter((p) => p.status !== 'hidden');
    return { total: catalog.products.length, visible: priced.length };
  }, [catalog]);

  function update(id: string, patch: Partial<PrivateProduct>) {
    setCatalog((c) => ({ ...c, products: c.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    setDirty(true);
  }

  function remove(id: string) {
    const p = catalog.products.find((x) => x.id === id);
    if (!p || !window.confirm(`¿Eliminar "${p.name}" de la lista local?`)) return;
    setCatalog((c) => ({ ...c, products: c.products.filter((x) => x.id !== id) }));
    setDirty(true);
  }

  function add() {
    setCatalog((c) => ({ ...c, products: [...c.products, newProduct()] }));
    setDirty(true);
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = validateCatalog(JSON.parse(await file.text()));
      setCatalog(parsed);
      setDirty(true);
      setMessage({ kind: 'ok', text: `Importados ${parsed.products.length} productos.` });
    } catch (err) {
      setMessage({ kind: 'error', text: `No se importó nada: ${err instanceof Error ? err.message : 'JSON inválido.'}` });
    }
  }

  function exportPrivate() {
    download('products.private.json', catalog);
    setDirty(false);
    setMessage({ kind: 'ok', text: 'Descargado products.private.json (PRIVADO). Reemplaza data/products.private.json y ejecuta npm run data:public.' });
  }

  function exportPublic() {
    download('catalog.public.json', { version: 1, products: toPublicProducts(catalog.products) });
    setMessage({ kind: 'ok', text: 'Descargado catalog.public.json. Colócalo en src/data/catalog.public.json y vuelve a desplegar.' });
  }

  function reset() {
    if (!window.confirm('¿Descartar los cambios locales y volver al contenido de data/products.private.json?')) return;
    clearSaved();
    setCatalog(structuredClone(seedCatalog));
    setDirty(false);
    setMessage({ kind: 'ok', text: 'Restaurado desde data/products.private.json.' });
  }

  return (
    <div className="admin">
      <div className="banner" role="alert">
        <strong>HERRAMIENTA LOCAL — NO ES SEGURA PARA INTERNET.</strong> No tiene contraseña ni servidor. Úsala solo con{' '}
        <code>npm run admin</code> en tu computadora. Contiene costos y ganancias privados: no la publiques ni compartas lo que exportes como “privado”.
      </div>

      <header className="admin-head">
        <div>
          <h1>Administración · Series 2 TCG</h1>
          <p className="muted">
            {totals.total} productos ({totals.visible} no ocultos). Los cambios se guardan en este navegador; para publicarlos exporta el JSON.
          </p>
        </div>
        <div className="actions">
          <button onClick={add}>+ Producto</button>
          <button onClick={() => fileRef.current?.click()}>Importar JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          <button onClick={exportPublic}>Exportar público</button>
          <button className="primary" onClick={exportPrivate}>Exportar privado{dirty ? ' •' : ''}</button>
          <button className="danger" onClick={reset}>Restaurar</button>
        </div>
      </header>

      {message && (
        <p className={`msg msg-${message.kind}`} role="status">
          {message.text}
        </p>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo / idioma</th>
              <th>Costo</th>
              <th>Precio venta</th>
              <th>Ganancia bruta</th>
              <th>Margen bruto</th>
              <th>Recargo s/costo</th>
              <th>Precio mín.</th>
              <th>Existencias</th>
              <th>Imagen</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {catalog.products.map((p) => {
              const r = calcProfit(p.cost, p.price);
              const belowMin = p.minPrice !== null && p.price < p.minPrice;
              return (
                <tr key={p.id} className={p.status === 'hidden' ? 'row-hidden' : ''}>
                  <td className="col-name">
                    <input aria-label="Nombre" value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} />
                    <input
                      aria-label="Descripción"
                      placeholder="Descripción (opcional)"
                      value={p.description}
                      onChange={(e) => update(p.id, { description: e.target.value })}
                    />
                  </td>
                  <td>
                    <select aria-label="Tipo" value={p.category} onChange={(e) => update(p.id, { category: e.target.value as CategoryId })}>
                      {CATEGORY_ORDER.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                    <select aria-label="Idioma" value={p.language} onChange={(e) => update(p.id, { language: e.target.value as Language })}>
                      <option value="en">Inglés</option>
                      <option value="es">Español</option>
                    </select>
                  </td>
                  <td>
                    <MoneyInput label="Costo" value={p.cost} onChange={(v) => update(p.id, { cost: v ?? 0 })} />
                    {p.costApproximate && <small className="muted">aprox.</small>}
                  </td>
                  <td>
                    <MoneyInput label="Precio de venta" value={p.price} onChange={(v) => update(p.id, { price: v ?? 0 })} />
                  </td>
                  <td className={r.profitCents < 0 ? 'neg' : 'pos'}>{formatMoney(r.profit)}</td>
                  <td>{formatPct(r.marginPct)}</td>
                  <td>{formatPct(r.markupPct)}</td>
                  <td>
                    <MoneyInput label="Precio mínimo" value={p.minPrice} nullable onChange={(v) => update(p.id, { minPrice: v })} />
                    {belowMin && <small className="neg">Precio bajo el mínimo</small>}
                  </td>
                  <td>
                    <input
                      aria-label="Existencias"
                      type="number"
                      min={0}
                      step={1}
                      placeholder="s/d"
                      value={p.stock ?? ''}
                      onChange={(e) => update(p.id, { stock: e.target.value === '' ? null : Math.max(0, Math.floor(Number(e.target.value))) })}
                    />
                  </td>
                  <td>
                    <input
                      aria-label="Imagen"
                      placeholder="/images/products/archivo.jpg"
                      value={p.image ?? ''}
                      onChange={(e) => update(p.id, { image: e.target.value.trim() || null })}
                    />
                  </td>
                  <td>
                    <select aria-label="Estado" value={p.status} onChange={(e) => update(p.id, { status: e.target.value as ProductStatus })}>
                      {(Object.keys(STATUS_LABELS) as ProductStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="danger" aria-label={`Eliminar ${p.name}`} onClick={() => remove(p.id)}>✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted note">
        Ganancia = precio de venta − costo · Margen = ganancia ÷ precio de venta · Recargo = ganancia ÷ costo. Son valores
        <strong> brutos por unidad</strong>: no incluyen impuestos, comisiones, envíos, publicidad ni otros gastos. “Existencias” vacío = sin registrar
        (se muestra como disponible si el estado es Disponible). Precio mínimo y costos nunca se exportan al archivo público.
      </p>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  nullable,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  nullable?: boolean;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      min={0}
      step="0.01"
      inputMode="decimal"
      placeholder={nullable ? 's/d' : '0'}
      value={value ?? ''}
      onChange={(e) => {
        if (e.target.value === '') return onChange(nullable ? null : 0);
        const n = Number(e.target.value);
        if (Number.isFinite(n) && n >= 0) onChange(n);
      }}
    />
  );
}
