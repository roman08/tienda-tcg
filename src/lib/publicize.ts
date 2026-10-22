import type { PrivateProduct, PublicProduct } from './types';

/** ¿Debe mostrarse el producto como disponible? Oculto y agotado => no. Stock desconocido (null) => sí. */
export function isAvailable(p: Pick<PrivateProduct, 'status' | 'stock'>): boolean {
  if (p.status !== 'available') return false;
  return p.stock === null || p.stock > 0;
}

/**
 * Única función que convierte un registro privado en público.
 * Construye el objeto campo por campo (lista blanca): jamás se hace spread
 * del producto privado, así un campo nuevo privado nunca se filtra por accidente.
 * Los productos con status "hidden" se excluyen por completo.
 */
export function toPublicProducts(products: PrivateProduct[]): PublicProduct[] {
  return products
    .filter((p) => p.status !== 'hidden')
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      language: p.language,
      condition: p.condition,
      price: p.price,
      available: isAvailable(p),
      image: p.image,
    }));
}
