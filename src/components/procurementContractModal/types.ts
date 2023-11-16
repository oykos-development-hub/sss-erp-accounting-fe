import {MicroserviceProps} from '../../types/micro-service-props';

export interface ProcurementContractModalProps {
  //add types here
  alert: any;
  fetch: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  navigate: (path: any) => void;
}
