import { useMemo } from 'react';
import { siteConfig } from './config/site';
import { buildWhatsAppUrl, normalizePhone } from './lib/whatsapp';

/** Número normalizado desde la configuración, o null si falta o es inválido. */
export function useWhatsAppPhone(): string | null {
  return useMemo(() => normalizePhone(siteConfig.whatsappNumber, siteConfig.defaultCountryCode), []);
}

export function whatsappLink(phone: string | null, message?: string): string | null {
  return phone ? buildWhatsAppUrl(phone, message) : null;
}
