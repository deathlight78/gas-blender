import { useAppStore } from '../store/app.store';
import { ko } from './locales/ko';
import { en } from './locales/en';

type Translations = typeof ko;
export type TranslationKey = keyof Translations;

const locales: Record<string, Translations> = { ko, en };

export function useTranslation() {
  const lang = useAppStore((s) => s.language);
  const dict = locales[lang] ?? locales.ko;

  function t(key: TranslationKey): string {
    return dict[key] ?? ko[key] ?? key;
  }

  return { t, lang };
}
