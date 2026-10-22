/** Falla el build si en dist/ aparece algo que sugiera datos privados. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN: Array<[string, RegExp]> = [
  ['campo "cost"', /["']?\bcost["']?\s*:/],
  ['campo "minPrice"', /\bminPrice\b/],
  ['campo "costApproximate"', /\bcostApproximate\b/],
  ['campo "stock"', /["']stock["']\s*:/],
  ['archivo privado', /products\.private/],
  ['herramienta de administración', /series2-admin/i],
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk('dist').filter((f) => /\.(html|js|json|css|svg|txt|xml|webmanifest)$/.test(f));
const problems: string[] = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const [label, re] of FORBIDDEN) if (re.test(text)) problems.push(`${f}: ${label}`);
}
if (problems.length) {
  console.error('❌ Posible fuga de datos privados:\n' + problems.join('\n'));
  process.exit(1);
}
console.log(`✔ check-leaks: ${files.length} archivos revisados, sin datos privados.`);
