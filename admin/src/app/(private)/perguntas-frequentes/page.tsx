'use client';

import { Button } from '@/components/ui/button';
import { FaqTable } from './components/faq-table';
import { useFaq } from '@/hooks/use-faq';
import { FaqModalController } from './components/faq-modal-controller';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FaqPage() {
  const { t } = useTranslation();
  const {
    faqList,
    isLoading,
    modal,
    setModal,
    onEdit,
    onDelete,
    onView,
    onCreate,
    updateFaq,
    createFaq,
    deleteFaq,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFaq();

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold dark:text-white text-gray-900 ">
            {t('menu.perguntas-frequentes')}
          </h1>
        </div>
        <Button
          onClick={onCreate}
          className="flex items-center gap-2 bg-[#3B6790] text-white hover:bg-[#2C4F6E]"
        >
          <PlusIcon className="text-white" />
          {t('faq.new')}
        </Button>
      </header>
      <Separator />

      <FaqTable
        list={faqList}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        isLoading={isLoading}
      />

      <FaqModalController
        modal={modal}
        createFaq={createFaq}
        updateFaq={updateFaq}
        deleteFaq={deleteFaq}
        isDeleting={isDeleting}
        onClose={() => setModal(null)}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}
