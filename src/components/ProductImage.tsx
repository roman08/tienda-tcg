import { useState } from 'react';
import type { PublicProduct } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/categories';

/**
 * Foto real si `image` está definida; si no (o si falla la carga), imagen
 * provisional claramente identificada. Sustituye la foto desde el panel local
 * o colocando el archivo en /public/images/products/ y poniendo su ruta.
 */
export function ProductImage({ product }: { product: PublicProduct }) {
  const [failed, setFailed] = useState(false);

  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        width={600}
        height={600}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="placeholder" role="img" aria-label={`Imagen provisional de ${product.name}`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="26" y="14" width="68" height="92" rx="10" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="52" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M44 52h32" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="52" r="5" fill="currentColor" />
      </svg>
      <span className="placeholder-type">{CATEGORY_LABELS[product.category]}</span>
      <span className="placeholder-note">Imagen provisional</span>
    </div>
  );
}
