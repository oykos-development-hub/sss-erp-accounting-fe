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

export const YearWrapper = styled.div`
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
`;

export const FiltersWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 25%;
`;
