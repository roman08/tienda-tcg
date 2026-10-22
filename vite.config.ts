import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './src/config/site';

/** Inyecta título, descripción y Open Graph desde src/config/site.ts en index.html. */
function seoPlugin(): Plugin {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'seo-from-config',
    transformIndexHtml(html) {
      const { seo, name } = siteConfig;
      const url = seo.siteUrl;
      const image = seo.ogImage ? (url ? `${url}${seo.ogImage}` : seo.ogImage) : '';
      return html
        .replaceAll('%SEO_TITLE%', esc(seo.title))
        .replaceAll('%SEO_DESCRIPTION%', esc(seo.description))
        .replaceAll('%SEO_LANG%', seo.lang)
        .replaceAll('%SITE_NAME%', esc(name))
        .replaceAll('%THEME_COLOR%', siteConfig.theme.black)
        .replace('%OG_URL%', url ? `<meta property="og:url" content="${esc(url)}/" />` : '')
        .replace('%OG_IMAGE%', image ? `<meta property="og:image" content="${esc(image)}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="${esc(image)}" />` : '<meta name="twitter:card" content="summary" />');
    },
  };
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: { target: 'es2020', sourcemap: false },
});
