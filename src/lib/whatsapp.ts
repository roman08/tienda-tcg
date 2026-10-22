/** Valida y normaliza un número de WhatsApp a dígitos internacionales (sin +). Devuelve null si es inválido. */
export function normalizePhone(raw: string, defaultCountryCode = '52'): string | null {
  let digits = (raw ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  // Número nacional de 10 dígitos: anteponer código de país.
  if (digits.length === 10) digits = defaultCountryCode + digits;
  // E.164: máximo 15 dígitos; mínimo razonable 11 (código de país + número).
  if (digits.length < 11 || digits.length > 15) return null;
  if (digits.startsWith('0')) return null;
  return digits;
}

export function buildWhatsAppUrl(phoneDigits: string, message?: string): string {
  const base = `https://wa.me/${phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Mensaje para el cliente. Solo nombre y precio público; nunca costos ni ganancias. */
export function buildProductMessage(name: string, publicPriceLabel?: string): string {
  const price = publicPriceLabel ? ` (precio publicado: ${publicPriceLabel})` : '';
  return `Hola, me interesa el producto ${name}${price}. ¿Me puedes confirmar el precio y la disponibilidad?`;
}

export const GENERAL_MESSAGE =
  'Hola, me gustaría consultar los productos de Pokémon TCG que tienes disponibles.';
