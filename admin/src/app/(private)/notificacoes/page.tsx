'use client';

import { Button } from '@/components/ui/button';
import { NotificationModalController } from './components/notification-modal-controller';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import { useNotification } from '@/hooks/use-notification';
import { NotificationsTable } from './components/notifications-table';
import { useTranslation } from 'react-i18next';

export default function NotificationPage() {
  const { t } = useTranslation();
  const {
    notificationList,
    isLoading,
    modal,
    setModal,
    onDelete,
    onView,
    onCreate,
    createNotification,
    deleteNotification,
    isCreating,
    isDeleting,
  } = useNotification();

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold dark:text-white text-gray-900 ">
            {t('menu.notificacoes')}
          </h1>
        </div>
        <Button
          onClick={onCreate}
          className="flex items-center gap-2 bg-[#3B6790] text-white hover:bg-[#2C4F6E]"
        >
          <PlusIcon className="text-white" />
          {t('notifications.new')}
        </Button>
      </header>
      <Separator />

      <NotificationsTable
        data={notificationList}
        onView={onView}
        onDelete={onDelete}
        isLoading={isLoading}
      />

      <NotificationModalController
        modal={modal}
        createNotification={createNotification}
        deleteNotification={deleteNotification}
        isDeleting={isDeleting}
        onClose={() => setModal(null)}
        isSaving={isCreating}
      />
    </div>
  );
}
