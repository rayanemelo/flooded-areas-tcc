import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AlagamentoDetalhesLoading() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{t('menu.alagamentos')}</h1>
      <Card className="w-full border border-border bg-card shadow-sm">
        <CardContent className="flex items-center justify-center flex-col gap-3 py-6 text-sm text-muted-foreground">
          <Loader2Icon className="size-10 animate-spin text-[#3B6790]" />
          {t('alagamentos.details.loading')}
        </CardContent>
      </Card>
    </div>
  );
}
