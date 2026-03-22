'use client';

import Link from 'next/link';
import { BookOpen, Headset, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SuportePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t('support.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('support.subtitle')}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-[#3B6790] dark:text-sky-300">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-sm font-semibold">
              {t('support.card.faq.title')}
            </h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {t('support.card.faq.description')}
          </p>
          <Link
            href="/perguntas-frequentes"
            className="inline-flex items-center rounded-md bg-[#3B6790] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f5477]"
          >
            {t('support.cta.faq')}
          </Link>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2 text-[#3B6790] dark:text-sky-300">
            <Headset className="h-5 w-5" />
            <h2 className="text-sm font-semibold">
              {t('support.card.contact.title')}
            </h2>
          </div>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            {t('support.card.contact.description')}
          </p>
          <div className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
            <p>
              <span className="font-medium">{t('support.contact.email-label')}:</span>{' '}
              suporte@tcc-admin.com
            </p>
            <p>
              <span className="font-medium">{t('support.contact.channel-label')}:</span>{' '}
              {t('support.contact.channel-value')}
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-red-200 bg-red-50/40 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/20">
          <div className="mb-3 flex items-center gap-2 text-red-700 dark:text-red-300">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-sm font-semibold">
              {t('support.card.security.title')}
            </h2>
          </div>
          <p className="text-sm text-red-800 dark:text-red-200">
            {t('support.card.security.description')}
          </p>
          <p className="mt-2 text-sm font-medium text-red-800 dark:text-red-200">
            {t('support.card.security.value')}
          </p>
        </article>
      </section>
    </div>
  );
}
