/**
 * Configuración centralizada de la tienda.
 * Edita este archivo para cambiar nombre, logotipo textual, lema, colores,
 * número de WhatsApp y textos SEO.
 */
export const siteConfig = {
  name: 'Series 2 TCG',
  /** Logotipo textual provisional: [parte clara, parte con acento]. */
  logo: { main: 'SERIES', accent: '2' },
  tagline: 'Tu próxima pieza de colección empieza aquí',

  hero: {
    title: 'Encuentra tu próxima pieza de colección',
    subtitle: 'Pokémon TCG en inglés. Productos originales y sellados',
  },

  /**
   * Número de WhatsApp. DEJAR VACÍO hasta tener el número real.
   * Formato libre: "993 123 4567", "+52 993 123 4567", "529931234567".
   * Si tiene 10 dígitos se antepone el código de país por defecto.
   */
  whatsappNumber: '',
  defaultCountryCode: '52',

  currency: 'MXN',
  locale: 'es-MX',

  seo: {
    title: 'Series 2 TCG | Pokémon TCG en inglés, original y sellado',
    description:
      'Catálogo de productos Pokémon TCG en inglés, originales y sellados: Elite Trainer Boxes, Booster Bundles y más. Consulta precio y disponibilidad por WhatsApp.',
    /** URL pública final (sin / al final). Se usa en Open Graph. Vacío hasta publicar. */
    siteUrl: '',
    /** Imagen para compartir enlaces (ruta dentro de /public). Pendiente: 1200x630 PNG/JPG. */
    ogImage: '',
    lang: 'es-MX',
  },

  theme: {
    black: '#0B0B10',
    purple: '#7C3AED',
    blue: '#3182F6',
    white: '#F1F5F9',
    gray: '#A1A1AA',
  },

  legal: {
    availability: 'Productos sujetos a disponibilidad.',
    disclaimer:
      'Series 2 TCG es una tienda independiente y no está afiliada oficialmente a The Pokémon Company. Pokémon y sus marcas pertenecen a sus respectivos propietarios.',
  },
} as const;

export type SiteConfig = typeof siteConfig;
