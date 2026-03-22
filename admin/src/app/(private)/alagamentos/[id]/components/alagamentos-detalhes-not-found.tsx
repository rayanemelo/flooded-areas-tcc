import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AlagamentoDetalhesNotFound() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{t('menu.alagamentos')}</h1>
      <Card className="w-full border border-border bg-card shadow-sm">
        <CardContent className="flex flex-col justify-center items-center gap-4 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {t('alagamentos.details.not-found-title')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
