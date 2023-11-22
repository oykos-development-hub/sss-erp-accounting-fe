export interface EditMovementModalProps {
  alert: any;
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: boolean) => void;
  dropdownData?: any;
  navigate: (path: any) => void;
}
