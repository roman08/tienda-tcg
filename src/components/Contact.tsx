import { GENERAL_MESSAGE } from '../lib/whatsapp';
import { whatsappLink } from '../hooks';
import { WhatsAppButton } from './WhatsAppButton';

export function Contact({ phone }: { phone: string | null }) {
  return (
    <section id="contacto" className="section section-contact" aria-labelledby="contacto-title">
      <div className="container contact-inner">
        <h2 id="contacto-title">Contacto</h2>
        <p className="section-sub">
          ¿Buscas algo que no ves en el catálogo? Escríbenos por WhatsApp y te confirmamos precio y disponibilidad.
        </p>
        <WhatsAppButton href={whatsappLink(phone, GENERAL_MESSAGE)}>Escribir por WhatsApp</WhatsAppButton>
        {!phone && <p className="muted small">El contacto por WhatsApp estará disponible próximamente.</p>}
      </div>
    </section>
  );
}
