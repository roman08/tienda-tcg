import type { PublicProduct } from '../lib/types';
import { CATEGORY_LABELS, LANGUAGE_LABELS } from '../lib/categories';
import { formatMoney } from '../lib/format';
import { buildProductMessage } from '../lib/whatsapp';
import { whatsappLink } from '../hooks';
import { siteConfig } from '../config/site';
import { ProductImage } from './ProductImage';
import { WhatsAppButton } from './WhatsAppButton';

export function ProductCard({ product, phone }: { product: PublicProduct; phone: string | null }) {
  const price = formatMoney(product.price);
  const href = product.available ? whatsappLink(phone, buildProductMessage(product.name, `${price} ${siteConfig.currency}`)) : null;

  return (
    <li className={`card${product.available ? '' : ' card-soldout'}`}>
      <div className="card-media">
        <ProductImage product={product} />
        {!product.available && <span className="badge badge-soldout">Agotado</span>}
      </div>
      <div className="card-body">
        <p className="card-type">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="card-title">{product.name}</h3>
        {product.description && <p className="card-desc">{product.description}</p>}
        <ul className="tags" aria-label="Detalles del producto">
          <li>Idioma: {LANGUAGE_LABELS[product.language]}</li>
          <li>Original y sellado</li>
        </ul>
        <p className="price">
          <span className="price-amount">{price}</span> <span className="price-cur">{siteConfig.currency}</span>
        </p>
        {product.available ? (
          <WhatsAppButton href={href} ariaLabel={`Consultar ${product.name} por WhatsApp`}>
            Consultar producto
          </WhatsAppButton>
        ) : (
          <button type="button" className="btn btn-ghost btn-md" disabled>
            No disponible
          </button>
        )}
      </div>
    </li>
  );
}
