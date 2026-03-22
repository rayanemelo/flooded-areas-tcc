'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Notification } from '@/services/notification';
import { ButtonWithLoader } from '@/components/button-with-loader/button-with-loader';

type Props = {
  isSaving: boolean;
  onClose: () => void;
  onSave: (n: Notification) => void;
};

export function NotificationFormModal({ isSaving, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  function handleSubmit() {
    const now = new Date().toLocaleDateString();

    onSave({
      id: crypto.randomUUID(),
      content,
      createdAt: now,
    });

    setContent('');
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('notifications.form.title')}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Textarea
            placeholder={t('notifications.form.placeholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-30"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('actions.cancel')}
            </Button>

            <ButtonWithLoader
              type="submit"
              disabled={isSaving}
              isLoading={isSaving}
              text={t('actions.save')}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
