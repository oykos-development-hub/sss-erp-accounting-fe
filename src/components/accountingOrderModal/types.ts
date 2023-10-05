export interface ProcurementContractModalProps {
  alert: any;
  fetch: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  navigate: (path: any) => void;
}
