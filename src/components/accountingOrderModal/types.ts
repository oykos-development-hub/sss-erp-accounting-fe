export interface ProcurementContractModalProps {
  //add types here
  alert: any;
  fetch: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  navigate: (path: any) => void;
}
