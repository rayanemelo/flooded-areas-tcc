'use client';

import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Language = 'pt' | 'en';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt';

  function changeLanguage(lang: Language) {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
      <span className="px-1 text-slate-500 dark:text-slate-300" aria-hidden="true">
        <Languages className="h-4 w-4" />
      </span>

      <button
        type="button"
        onClick={() => changeLanguage('pt')}
        className={`rounded-full px-2 py-1 text-xs font-medium transition-colors ${
          currentLanguage === 'pt'
            ? 'bg-[#3B6790] text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
        title={t('language-pt')}
        aria-label={t('language-pt')}
      >
        PT
      </button>

      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`rounded-full px-2 py-1 text-xs font-medium transition-colors ${
          currentLanguage === 'en'
            ? 'bg-[#3B6790] text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
        title={t('language-en')}
        aria-label={t('language-en')}
      >
        EN
      </button>
    </div>
  );
}
