import {MicroserviceProps} from '../../types/micro-service-props';

export interface AssetMovementModalProps {
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  selectedItem: number;
  fetch: () => void;
}
