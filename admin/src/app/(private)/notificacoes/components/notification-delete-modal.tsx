'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ButtonWithLoader } from '@/components/button-with-loader/button-with-loader';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

export function NotificationDeleteModal({
  onClose,
  onConfirm,
  isDeleting,
}: Props) {
  const { t } = useTranslation();

  async function handleConfirm() {
    await onConfirm();
    onClose();
  }
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('notifications.delete.confirm-title')}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('actions.cancel')}
          </Button>

          <ButtonWithLoader
            onClick={handleConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            text={t('actions.delete')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
