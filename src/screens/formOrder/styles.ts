import styled from 'styled-components';
import {Theme, Input, Typography} from 'client-library';

export const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 22px 0px;
`;

export const Totals = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 30px;
`;

export const FormFooter = styled.div`
  width: 100%;
  height: 91px;
  border-radius: 0px 0px 8px 8px;
  border-top: 2px solid ${Theme.palette.primary500};
  background-color: ${Theme.palette.gray50};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 10px;
  box-sizing: border-box;
  margin-top: 30px;
`;

export const FormControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const AmountInput = styled(Input)`
  width: 90px;
  border-radius: 8px;
`;

export const AccordionWrapper = styled.div`
  position: relative;
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${Theme?.palette?.gray50};
  padding: 10px 16px;
  border-bottom: 0;
`;

export const AccordionIconsWrapper = styled.div<{isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  > svg {
    padding: 5px;
    border-radius: 8px;
    height: 16px;
    :hover {
      background-color: ${Theme?.palette?.gray100};
    }
  }
  & svg:first-child {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${props => (props.isOpen ? '180deg' : '0deg')});
  }
`;

export const Menu = styled.div<{open: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  position: absolute;
  right: 35px;
  top: 5px;
  z-index: 99;
  height: ${props => (props.open ? 'auto' : '0')};
  overflow: hidden;
  transition: height 0.3s ease;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 14px;
  z-index: 99;

  :hover {
    background-color: ${Theme?.palette?.gray100};
  }
`;

export const MovementTableContainer = styled.div`
  margin-top: 30px;

  div {
    margin-top: 0;
  }
`;

export const TableTitle = styled(Typography)`
  font-weight: 700;
  margin-left: 20px;
  padding-top: 10px;
`;

export const FileUploadWrapper = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-block: 10px;
`;

export const ErrorText = styled.span`
  color: ${Theme.palette.error500};
  font-size: 12px;
`;

export const RowWrapper = styled.div`
  width: 300px;
`;

export const TextInput = styled(Input)`
  width: 300px;
`;

export const ButtonContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;
