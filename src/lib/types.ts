export type CategoryId = 'etb' | 'booster-bundle' | 'booster-box' | 'otros';
export type ProductStatus = 'available' | 'soldout' | 'hidden';
export type Language = 'en' | 'es';

/** Registro COMPLETO. Solo lo usan la herramienta de administración local y los scripts. */
export interface PrivateProduct {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  language: Language;
  condition: 'sealed';
  /** Costo de compra en MXN (privado). */
  cost: number;
  /** El costo es una estimación. */
  costApproximate?: boolean;
  /** Precio público de venta en MXN. */
  price: number;
  /** Precio mínimo de venta en MXN (privado, control interno). */
  minPrice: number | null;
  /** null = existencias sin registrar. */
  stock: number | null;
  /** Ruta de imagen (p. ej. /images/products/etb-151.jpg) o null para usar la provisional. */
  image: string | null;
  status: ProductStatus;
}

export interface PrivateCatalogFile {
  version: 1;
  products: PrivateProduct[];
}

/** Lo ÚNICO que llega al navegador del público. Sin costos, mínimos ni existencias. */
export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  language: Language;
  condition: 'sealed';
  price: number;
  available: boolean;
  image: string | null;
}

export interface PublicCatalogFile {
  version: 1;
  products: PublicProduct[];
}
