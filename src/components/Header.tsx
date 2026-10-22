import { siteConfig } from '../config/site';
import { GENERAL_MESSAGE } from '../lib/whatsapp';
import { whatsappLink } from '../hooks';
import { WhatsAppButton } from './WhatsAppButton';

export function Header({ phone }: { phone: string | null }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#inicio" aria-label={`${siteConfig.name}: inicio`}>
          <span className="logo-main">{siteConfig.logo.main}</span>
          <span className="logo-accent">{siteConfig.logo.accent}</span>
          <span className="logo-sub">TCG</span>
        </a>
        <nav aria-label="Principal" className="nav">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <WhatsAppButton href={whatsappLink(phone, GENERAL_MESSAGE)} size="sm">
          WhatsApp
        </WhatsAppButton>
      </div>
    </header>
  );
}
