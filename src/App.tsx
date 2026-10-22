import catalogFile from './data/catalog.public.json';
import type { PublicCatalogFile } from './lib/types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { NotFound } from './components/NotFound';
import { useWhatsAppPhone } from './hooks';
import { siteConfig } from './config/site';

const catalog = catalogFile as PublicCatalogFile;

function isHomePath(): boolean {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' || p === '/index.html';
}

export default function App() {
  const phone = useWhatsAppPhone();

  if (!isHomePath()) return <NotFound />;

  return (
    <>
      <a className="skip-link" href="#catalogo">Saltar al catálogo</a>
      {import.meta.env.DEV && !phone && (
        <div className="admin-notice" role="status">
          Aviso para el administrador: configura <code>whatsappNumber</code> en <code>src/config/site.ts</code>.
          Mientras esté vacío, los botones de WhatsApp aparecen deshabilitados. (Este aviso solo se ve en desarrollo.)
        </div>
      )}
      <Header phone={phone} />
      <main>
        <Hero phone={phone} />
        <Catalog products={catalog.products} phone={phone} />
        <Contact phone={phone} />
      </main>
      <Footer phone={phone} />
      <noscript>{siteConfig.name}</noscript>
    </>
  );
}
