import { ModalState } from '@/hooks/use-faq';
import { FaqDeleteModal } from './faq-delete-modal';
import { FaqFormModal } from './faq-form-modal';
import { FaqViewModal } from './faq-view-modal';
import { Faq } from '@/services/faq';

type Props = {
  modal: ModalState;
  isSaving: boolean;
  isDeleting: boolean;
  onClose: () => void;
  deleteFaq: (id: string) => Promise<void>;
  createFaq: (faq: Partial<Faq>) => Promise<Faq>;
  updateFaq: (faq: Partial<Faq>) => Promise<Faq>;
};

export function FaqModalController({
  modal,
  onClose,
  updateFaq,
  createFaq,
  deleteFaq,
  isSaving,
  isDeleting,
}: Props) {
  if (!modal) return null;

  switch (modal.type) {
    case 'view':
      return <FaqViewModal faq={modal.faq} onClose={onClose} />;
    case 'edit':
    case 'create':
      return (
        <FaqFormModal
          faq={modal.type === 'edit' ? modal.faq : null}
          onClose={onClose}
          onSave={modal.type === 'edit' ? updateFaq : createFaq}
          isSaving={isSaving}
        />
      );
    case 'delete':
      return (
        <FaqDeleteModal
          isDeleting={isDeleting}
          onClose={onClose}
          onConfirm={() => deleteFaq(modal.faq.id)}
        />
      );
  }
}
