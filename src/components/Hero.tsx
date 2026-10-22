import { siteConfig } from '../config/site';
import { GENERAL_MESSAGE } from '../lib/whatsapp';
import { whatsappLink } from '../hooks';
import { WhatsAppButton } from './WhatsAppButton';

export function Hero({ phone }: { phone: string | null }) {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="eyebrow">{siteConfig.tagline}</p>
        <h1 id="hero-title">{siteConfig.hero.title}</h1>
        <p className="hero-sub">{siteConfig.hero.subtitle}</p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-md" href="#catalogo">Explorar catálogo</a>
          <WhatsAppButton href={whatsappLink(phone, GENERAL_MESSAGE)} variant="ghost">
            Consultar por WhatsApp
          </WhatsAppButton>
        </div>
        <ul className="hero-badges" aria-label="Características">
          <li>Pokémon TCG en inglés</li>
          <li>Originales</li>
          <li>Sellados</li>
        </ul>
      </div>
    </section>
  );
}
