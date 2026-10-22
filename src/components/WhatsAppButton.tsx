import type { ReactNode } from 'react';

interface Props {
  href: string | null;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

/** Enlace a WhatsApp. Sin número configurado se muestra deshabilitado (sin inventar teléfono). */
export function WhatsAppButton({ href, children, variant = 'primary', size = 'md', ariaLabel }: Props) {
  const cls = `btn btn-${variant} btn-${size}`;
  if (!href) {
    return (
      <button type="button" className={cls} disabled aria-label={ariaLabel} title="Contacto por WhatsApp próximamente">
        {children}
      </button>
    );
  }
  return (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
      {children}
    </a>
  );
}
