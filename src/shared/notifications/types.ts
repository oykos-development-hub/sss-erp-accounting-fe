export interface ModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  handleLeftButtomClick: (action?: any) => void;
  customContent?: any;
  subTitle?: string;
}
