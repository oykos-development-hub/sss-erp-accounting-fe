import styled from 'styled-components';
import {Theme, Table, Typography, Divider} from 'client-library';

export const TableContainer = styled(Table)`
  padding-bottom: 22px;
`;
export const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  float: right;

  > svg {
    padding: 5px;
    border-radius: 8px;
    height: 16px;

    :hover {
      background-color: ${Theme?.palette?.gray100};
    }
  }
`;
export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const SubTitle = styled(Typography)`
  font-weight: 600;
`;

export const SectionBox = styled.div`
  margin-top: 25px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 10px;
  margin-top: 33px;
  margin-bottom: 33px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;
`;

export const Controls = styled.div`
  display: flex;
  gap: 5px;
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray200};
`;

export const InlineText = styled.div`
  white-space: nowrap;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;
