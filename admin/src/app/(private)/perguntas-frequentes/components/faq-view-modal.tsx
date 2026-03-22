'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Faq } from '@/services/faq';
import { formatDateTime } from '@/utils/format-date-time';
import { useTranslation } from 'react-i18next';

type Props = {
  faq: Faq | null;
  onClose: () => void;
};

export function FaqViewModal({ faq, onClose }: Props) {
  const { t } = useTranslation();

  if (!faq) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{t('faq.view.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm w-115.5 max-h-96 overflow-x-auto">
          <div>
            <h3 className="font-medium text-muted-foreground">
              {t('table.question')}
            </h3>
            <p className="mt-1 whitespace-pre-line">{faq.question}</p>
          </div>

          <div>
            <h3 className="font-medium text-muted-foreground">
              {t('table.answer')}
            </h3>
            <p className="mt-1 whitespace-pre-line">{faq.answer}</p>
          </div>

          <div className="flex gap-6 pt-2 text-xs text-muted-foreground">
            <span>
              {t('table.created-at')}: {formatDateTime(faq.createdAt)}
            </span>
            <span>
              {t('table.updated-at')}: {formatDateTime(faq.updatedAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
