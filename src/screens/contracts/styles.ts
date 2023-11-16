import {Typography, Theme, Divider} from 'client-library';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: ${Theme?.palette?.white};
  padding: 20px;

  & > span {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray800};
`;

export const StatusTextWrapper = styled.div`
  white-space: nowrap;
`;

export const StatusText = styled(Typography)`
  padding: 8px;
  line-height: 20px;
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
`;

export const DropdownsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const IconsWrapper = styled.div`
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
`;

export const Filters = styled.div`
  margin-right: 10px;
  width: 320px;
`;

export const AlertWrapper = styled.div`
  position: fixed;
  bottom: 75px;
  right: 23px;
  width: 40%;
`;

export const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

export const Price = styled(Typography)`
  padding: 14px 0 0 12px;
`;

export const Column = styled.div`
  width: 320px;
`;

export const FormFooter = styled.div`
  width: 100%;
  height: 91px;
  border-top: 1px solid ${Theme.palette.gray500};
  background-color: ${Theme.palette.gray50};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  margin-top: 20px;
`;

export const FormControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Plan = styled.div`
  margin-top: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${Theme.palette.gray50};
  padding: 10px;
`;

export const FileUploadWrapper = styled.div`
  max-width: 600px;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;

  > div > div {
    display: block;
    width: 100%;
    & div > p > p {
      font-weight: 600;
      line-height: 20px;
    }
  }
`;

export const ErrorText = styled.span`
  color: ${Theme.palette.error500};
  font-size: 12px;
`;
