import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertDialogProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onConfirmNavigateTo?: string;
  onCancelNavigateTo?: string;
};

export function AlertDialog({
  children,
  title = "Você tem certeza?",
  description,
  confirmText = "Continuar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onConfirmNavigateTo,
  onCancelNavigateTo,
}: AlertDialogProps) {
  return (
    <ShadcnAlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancelNavigateTo ? (
            <a href={onCancelNavigateTo} onClick={onCancel}>
              <AlertDialogCancel className="w-full">
                {cancelText}
              </AlertDialogCancel>
            </a>
          ) : (
            <AlertDialogCancel onClick={onCancel}>
              {cancelText}
            </AlertDialogCancel>
          )}
          {onConfirmNavigateTo ? (
            <a href={onConfirmNavigateTo} onClick={onConfirm}>
              <AlertDialogAction className="w-full">
                {confirmText}
              </AlertDialogAction>
            </a>
          ) : (
            <AlertDialogAction onClick={onConfirm}>
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
}
