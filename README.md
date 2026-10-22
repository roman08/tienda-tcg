# Series 2 TCG — Catálogo digital

Catálogo público de productos Pokémon TCG (en inglés, originales y sellados) con consulta por WhatsApp y una herramienta **local** para administrar precios, costos y existencias.

Stack: React 18 + TypeScript + Vite. Sin backend, sin dependencias de runtime extra, sin costos recurrentes.

## Inicio rápido

```bash
npm install
npm run dev        # catálogo público en http://localhost:5173
npm run admin      # herramienta de administración LOCAL en http://127.0.0.1:5174
npm test           # pruebas (ganancias, WhatsApp, datos, renderizado)
npm run build      # genera dist/ y verifica que no se filtren datos privados
```

## Cómo está organizado

```
data/products.private.json   ← FUENTE DE VERDAD (privada: costos, mínimos, existencias). No se sube a git.
src/data/catalog.public.json ← GENERADO: solo lo que ve el cliente. Es lo único que importa el sitio.
src/lib/publicize.ts         ← única función privado → público (lista blanca de campos)
src/lib/profit.ts            ← ganancia, margen y recargo en aritmética de centavos
src/lib/whatsapp.ts          ← validación del número y enlace wa.me
src/config/site.ts           ← nombre, logo, lema, colores, SEO, número de WhatsApp
admin/                       ← herramienta local (NO entra al build público)
scripts/                     ← seed, generador público, verificador de fugas
```

`npm run dev` y `npm run build` ejecutan automáticamente `npm run data:public`, que regenera el JSON público desde el privado. Si el archivo privado no existe (por ejemplo en Vercel), se usa el público ya versionado.

## Configuración

Todo en `src/config/site.ts`:

| Campo | Qué hace |
|---|---|
| `name`, `logo`, `tagline`, `hero` | Marca y textos principales |
| `theme` | Paleta (se aplica como variables CSS) |
| `whatsappNumber` | **Vacío por defecto.** Ej.: `'993 123 4567'` o `'+52 993 123 4567'`. Con 10 dígitos se antepone `defaultCountryCode` (`52`) |
| `seo.title`, `seo.description` | Título y descripción SEO / Open Graph (se inyectan en `index.html` al compilar) |
| `seo.siteUrl`, `seo.ogImage` | URL final y imagen para compartir enlaces (pendientes de definir) |
| `legal` | Avisos del pie de página |

No hay variables de entorno obligatorias.

## Flujo para actualizar precios

1. `npm run admin` y edita precios, costos, mínimos, existencias, imágenes y estado.
2. **Exportar privado** → reemplaza `data/products.private.json` (tu respaldo completo).
3. `npm run data:public` → regenera `src/data/catalog.public.json`.
4. Sube los cambios y vuelve a desplegar (ver abajo). Alternativa: **Exportar público** descarga directamente `catalog.public.json` para colocarlo en `src/data/`.

El catálogo público y la herramienta leen del mismo archivo de datos, por lo que los precios nunca divergen.

### Estados y existencias

| Estado | En el catálogo público |
|---|---|
| Disponible | Visible con botón “Consultar producto” |
| Agotado | Visible con etiqueta “Agotado” y sin botón de contacto |
| Oculto | No se publica |

Existencias vacías = “sin registrar”: el producto se trata como disponible. Con existencias `0` se muestra como agotado automáticamente.

### Imágenes

No se incluyen fotos de productos (no se usaron imágenes sin verificar). Mientras no haya foto se muestra una imagen **provisional** rotulada. Para usar una foto propia: copia el archivo a `public/images/products/` y escribe su ruta en el campo “Imagen” (`/images/products/etb-151.jpg`). Se recomiendan fotos cuadradas, ≤ 150 KB, en WebP/JPG.

## Despliegue gratuito (Vercel)

1. Crea un repositorio **privado** en GitHub y sube el proyecto (`data/products.private.json` queda fuera por `.gitignore`).
2. En Vercel: *Add New → Project* → importa el repo. Framework: **Vite**. Build: `npm run build`. Salida: `dist`.
3. Antes de publicar, rellena `whatsappNumber`, `seo.siteUrl` y `seo.ogImage`.
4. Cada actualización de precios = `npm run data:public`, commit de `src/data/catalog.public.json` y push.

Netlify, Cloudflare Pages o GitHub Pages funcionan igual (publicando `dist`). `public/404.html` se usa como página 404.

## Seguridad y limitaciones (léelo)

- **La administración NO es segura para internet.** No tiene autenticación: es una herramienta local que solo escucha en `127.0.0.1` y no se incluye en el build público. Nunca la despliegues.
- **Persistencia local:** los cambios se guardan en el `localStorage` del navegador (se pierden si borras datos del sitio o cambias de equipo/navegador). Para conservarlos usa **Exportar privado** y guarda el archivo. No sincroniza entre dispositivos.
- **Costos y ganancias** viven solo en `data/products.private.json` y en la herramienta local. El sitio público importa únicamente el JSON generado por lista blanca; `npm run build` ejecuta `scripts/check-leaks.ts` y falla si en `dist/` aparece `cost`, `minPrice`, `stock`, etc.
- **Mantén el repositorio privado** si decides versionar el archivo privado. No lo subas a un repo público.
- **Todo precio público es visible por cualquiera** y cualquiera puede cambiar tu precio en su propio navegador sin afectarte; confirma siempre el precio por WhatsApp.
- Administrar desde varios dispositivos requeriría un backend con autenticación real (p. ej. Supabase o Firebase en plan gratuito); no está implementado.
- Ganancia, margen y recargo son **brutos por unidad**: no incluyen impuestos, comisiones, envíos, publicidad ni otros gastos.

## Datos iniciales

Los 23 productos y precios provienen de tu tabla. Notas:

- Los costos de **ETB 151** y **ETB Obsidian Flames** están marcados como aproximados.
- Precios de venta = valores iniciales editables, no precios de mercado verificados.
- Precio mínimo y existencias empiezan **sin definir** (no se inventaron).
- **Series 2** y **Series 3** están en la categoría “Otros” porque no se indicó su tipo de producto. Cámbiala en la herramienta de administración.
- Todos inician como “Disponible” con existencias sin registrar; ajusta el estado real antes de publicar.

## Añadir productos en español después

En la herramienta, **+ Producto** y elige idioma “Español” (se crea oculto hasta que lo marques Disponible). El catálogo ya renderiza el idioma de cada tarjeta, así que no hay que tocar el código.

## Pendientes antes de publicar

- [ ] Poner el número real en `whatsappNumber` y probar un enlace
- [ ] Revisar estado y existencias reales de cada producto
- [ ] Indicar el tipo correcto de Series 2 / Series 3
- [ ] Añadir fotos reales propias de los productos
- [ ] Definir nombre y logo definitivos (hoy: “Series 2 TCG”, provisional)
- [ ] Definir `seo.siteUrl` y crear imagen Open Graph 1200×630 (`seo.ogImage`)
- [ ] Confirmar costos aproximados de ETB 151 y ETB Obsidian Flames
- [ ] Capturar precio mínimo por producto (opcional)
- [ ] Crear repositorio privado y proyecto en Vercel
- [ ] Revisar el sitio en un teléfono real
