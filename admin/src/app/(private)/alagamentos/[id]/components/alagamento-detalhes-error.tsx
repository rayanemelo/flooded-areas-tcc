import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AlagamentoDetalhesError() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{t('menu.alagamentos')}</h1>
      <Card className="w-full border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col items-center justify-center text-center gap-3 pb-0">
          <span className="rounded-full bg-amber-100 p-3 text-amber-700">
            <AlertTriangle className="size-10" />
          </span>
          <div className="space-y-1">
            <CardTitle className="text-base">
              {t('alagamentos.details.error-title')}
            </CardTitle>
            <CardDescription>
              {t('alagamentos.details.load-error')}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
