import { describe, expect, it } from 'vitest';
import { buildProductMessage, buildWhatsAppUrl, normalizePhone } from '../src/lib/whatsapp';

describe('normalizePhone', () => {
  it('rechaza vacío y basura', () => {
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone('abc')).toBeNull();
    expect(normalizePhone('123')).toBeNull();
  });
  it('antepone el código de país a 10 dígitos', () => {
    expect(normalizePhone('993 123 4567')).toBe('529931234567');
  });
  it('acepta formato internacional con + y guiones', () => {
    expect(normalizePhone('+52 (993) 123-4567')).toBe('529931234567');
    expect(normalizePhone('0052 993 123 4567')).toBe('529931234567');
  });
  it('rechaza números demasiado largos', () => {
    expect(normalizePhone('1234567890123456')).toBeNull();
  });
});

describe('buildWhatsAppUrl / buildProductMessage', () => {
  it('codifica el mensaje', () => {
    const msg = buildProductMessage('ETB 151', '$12,000');
    const url = buildWhatsAppUrl('529931234567', msg);
    expect(url.startsWith('https://wa.me/529931234567?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(msg);
    expect(msg).toContain('ETB 151');
    expect(msg).toContain('¿Me puedes confirmar el precio y la disponibilidad?');
  });
});
