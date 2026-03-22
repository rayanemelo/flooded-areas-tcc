'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Faq } from '@/services/faq';
import { ButtonWithLoader } from '@/components/button-with-loader/button-with-loader';
import { DialogDescription } from '@radix-ui/react-dialog';
import { FormTextarea } from '@/components/form-textarea/form-textarea';
import { FormInput } from '@/components/form-input/form-input';

type Props = {
  faq: Faq | null;
  onClose: () => void;
  onSave: (faq: Partial<Faq>) => Promise<Faq>;
  isSaving: boolean;
};

export function FaqFormModal({ faq, onClose, onSave, isSaving }: Props) {
  const { t } = useTranslation();
  const questionRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);

  async function handleSave() {
    await onSave({
      id: faq?.id,
      question: questionRef.current?.value ?? '',
      answer: answerRef.current?.value ?? '',
    });

    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-w-2.5 overflow-x-hidden"
      >
        <DialogHeader>
          <DialogTitle>
            {faq ? t('faq.form.edit-title') : t('faq.form.create-title')}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {faq ? t('faq.form.edit-description') : t('faq.form.create-description')}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <FormInput
            required
            ref={questionRef}
            name="question"
            label={t('table.question')}
            placeholder={t('faq.form.question-placeholder')}
            defaultValue={faq?.question ?? ''}
            min={1}
            max={500}
          />

          <FormTextarea
            required
            ref={answerRef}
            name="answer"
            label={t('table.answer')}
            placeholder={t('faq.form.answer-placeholder')}
            defaultValue={faq?.answer ?? ''}
            maxLength={1000}
            minLength={1}
            className="w-115.5 min-h-24 max-h-48 resize-y overflow-auto text-primary"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
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
