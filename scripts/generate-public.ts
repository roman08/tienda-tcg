/**
 * Convierte data/products.private.json (privado) en src/data/catalog.public.json (público).
 * El catálogo público importa SOLO el archivo generado.
 * Si el archivo privado no existe (p. ej. en el servidor de despliegue), se conserva
 * el público ya generado y versionado.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { toPublicProducts } from '../src/lib/publicize';
import type { PrivateCatalogFile, PublicCatalogFile } from '../src/lib/types';

const PRIVATE = 'data/products.private.json';
const PUBLIC = 'src/data/catalog.public.json';

if (!existsSync(PRIVATE)) {
  if (existsSync(PUBLIC)) {
    console.log(`[data:public] ${PRIVATE} no existe; se usa ${PUBLIC} existente.`);
    process.exit(0);
  }
  console.error(`[data:public] No existe ni ${PRIVATE} ni ${PUBLIC}.`);
  process.exit(1);
}

const priv = JSON.parse(readFileSync(PRIVATE, 'utf8')) as PrivateCatalogFile;
const out: PublicCatalogFile = { version: 1, products: toPublicProducts(priv.products) };
mkdirSync(dirname(PUBLIC), { recursive: true });
writeFileSync(PUBLIC, JSON.stringify(out, null, 2) + '\n');
console.log(`[data:public] ${out.products.length} productos públicos escritos en ${PUBLIC}.`);
