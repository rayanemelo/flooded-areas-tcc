'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle } from '@/layout/components/language-toggle';
import { ThemeToggle } from '@/layout/components/theme-toggle';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LoginForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = '/home';
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email">{t('login.email-label')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('login.email-placeholder')}
            className="pl-9"
            required
          />
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-1">
        <Label htmlFor="password">{t('login.password-label')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('login.password-placeholder')}
            className="pl-9 pr-9"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            aria-label={
              showPassword
                ? t('login.hide-password')
                : t('login.show-password')
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('login.entering') : t('login.enter')}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-[#0b2238] px-4">
      <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm border-slate-200/80 bg-white/95 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {t('login.title')}
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('login.subtitle')}
          </p>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/admin/recover-password"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t('login.forgot-password')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
