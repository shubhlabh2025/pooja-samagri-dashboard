export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headingText: string;
  bodyText?: string;
  confirmationButtonText?: string;
  cancelButtonText?: string;
  confirmationButtonClassName?: string;
  cancellationButtonClassName?: string;
  onConfirm: () => void;
}
