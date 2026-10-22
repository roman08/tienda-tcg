import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Catalog } from '../src/components/Catalog';
import type { PublicCatalogFile } from '../src/lib/types';

const pub = JSON.parse(readFileSync('src/data/catalog.public.json', 'utf8')) as PublicCatalogFile;

describe('render del catálogo', () => {
  it('muestra los 23 productos con precio público y botón "Consultar producto"', () => {
    const html = renderToStaticMarkup(<Catalog products={pub.products} phone={null} />);
    expect(html.match(/class="card"/g)).toHaveLength(23);
    expect(html).toContain('Imagen provisional');
    expect(html).toContain('$12,000');
    expect(html.match(/Consultar producto/g)).toHaveLength(23);
  });

  it('sin número configurado los botones quedan deshabilitados (no hay enlaces wa.me)', () => {
    const html = renderToStaticMarkup(<Catalog products={pub.products} phone={null} />);
    expect(html).not.toContain('wa.me');
    expect(html).toContain('disabled');
  });

  it('con número configurado genera enlaces wa.me con el mensaje codificado y sin costos', () => {
    const html = renderToStaticMarkup(<Catalog products={pub.products.slice(0, 1)} phone="529931234567" />);
    expect(html).toContain('https://wa.me/529931234567?text=');
    expect(html).toContain(encodeURIComponent('Hola, me interesa el producto Series 2'));
    expect(html).not.toMatch(/costo|ganancia|margen/i);
  });

  it('un producto agotado no aparece como disponible', () => {
    const sold = { ...pub.products[0], available: false };
    const html = renderToStaticMarkup(<Catalog products={[sold]} phone="529931234567" />);
    expect(html).toContain('Agotado');
    expect(html).not.toContain('wa.me');
    expect(html).not.toContain('Consultar producto');
  });
});
