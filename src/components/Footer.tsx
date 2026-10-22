import { siteConfig } from '../config/site';
import { GENERAL_MESSAGE } from '../lib/whatsapp';
import { whatsappLink } from '../hooks';

export function Footer({ phone }: { phone: string | null }) {
  const href = whatsappLink(phone, GENERAL_MESSAGE);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{siteConfig.name}</p>
          <p className="muted small">{siteConfig.tagline}</p>
          {href ? (
            <a className="footer-link" href={href} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          ) : (
            <span className="muted small">WhatsApp: próximamente</span>
          )}
        </div>
        <div className="footer-legal">
          <p>{siteConfig.legal.availability}</p>
          <p>{siteConfig.legal.disclaimer}</p>
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
