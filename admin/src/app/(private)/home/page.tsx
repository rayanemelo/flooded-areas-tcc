'use client';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CircleHelp,
  LifeBuoy,
  Map,
  Waves,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const menuCards = [
  {
    titleKey: 'menu.alagamentos',
    href: '/alagamentos',
    icon: Waves,
  },
  {
    titleKey: 'menu.mapa',
    href: '/mapa',
    icon: Map,
  },
  {
    titleKey: 'menu.notificacoes',
    href: '/notificacoes',
    icon: Bell,
  },
  {
    titleKey: 'menu.perguntas-frequentes',
    href: '/perguntas-frequentes',
    icon: CircleHelp,
  },
  {
    titleKey: 'menu.suporte',
    href: '/suporte',
    icon: LifeBuoy,
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {t('home.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('home.subtitle')}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {menuCards.map(({ titleKey, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3B6790]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-300/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B6790]/10 text-[#3B6790] dark:bg-sky-300/15 dark:text-sky-300">
                <Icon className="h-5 w-5" />
              </div>

              <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {t(titleKey)}
              </span>
            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500" />
          </Link>
        ))}
      </section>
    </div>
  );
}
