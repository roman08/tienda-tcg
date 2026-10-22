import type { CategoryId } from './types';

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  etb: 'Elite Trainer Box',
  'booster-bundle': 'Booster Bundle',
  'booster-box': 'Booster Box',
  otros: 'Otros',
};

export const CATEGORY_ORDER: CategoryId[] = ['etb', 'booster-bundle', 'booster-box', 'otros'];

export const LANGUAGE_LABELS = { en: 'Inglés', es: 'Español' } as const;
