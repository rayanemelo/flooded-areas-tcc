import { ModalStateNotification } from '@/hooks/use-notification';

import { Notification } from '@/services/notification';
import { NotificationFormModal } from './notification-form-modal';
import { NotificationViewModal } from './notification-view-modal';
import { NotificationDeleteModal } from './notification-delete-modal';

type Props = {
  modal: ModalStateNotification;
  isSaving: boolean;
  isDeleting: boolean;
  onClose: () => void;
  deleteNotification: (id: string) => Promise<void>;
  createNotification: (faq: Partial<Notification>) => Promise<Notification>;
};

export function NotificationModalController({
  modal,
  onClose,
  createNotification,
  deleteNotification,
  isSaving,
  isDeleting,
}: Props) {
  if (!modal) return null;

  switch (modal.type) {
    case 'view':
      return (
        <NotificationViewModal
          notification={modal.notification}
          onClose={onClose}
        />
      );
    case 'create':
      return (
        <NotificationFormModal
          onClose={onClose}
          onSave={createNotification}
          isSaving={isSaving}
        />
      );
    case 'delete':
      return (
        <NotificationDeleteModal
          isDeleting={isDeleting}
          onClose={onClose}
          onConfirm={() => deleteNotification(modal.notification.id)}
        />
      );
  }
}
