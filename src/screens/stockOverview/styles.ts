import {Divider, Tabs, Theme, Typography} from 'client-library';
import styled from 'styled-components';

export const SectionBox = styled.div`
  margin-top: 25px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: #ffffff;
  padding: 20px;
`;

export const TitleTabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MainTitle = styled(Typography)`
  font-weight: 600;
`;

export const ArticleTitleWrapper = styled.div`
  margin-top: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${Theme.palette.gray50};
  padding: 10px;
`;

export const StyledTabs = styled(Tabs)`
  border-width: 1px;
  white-space: nowrap;

  button {
    border-radius: 0.5em 0.5em 0 0;
  }
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray200};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 33px;
  margin-bottom: 10px;
`;

export const Filter = styled.div`
  width: 90%;
  margin-top: 33px;
  margin-bottom: 10px;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

export const Column = styled.div`
  width: 300px;
`;

export const FileUploadWrapper = styled.div`
  max-width: 350px;
  align-items: center;
  width: 100%;
  margin-top: 10px;

  > div > div {
    display: block;
    width: 100%;

    & div > p > p {
      font-weight: 600;
      line-height: 20px;
    }
  }
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

export const InputWrapper = styled.div`
  width: 90%;
  margin-top: 20px;
  margin-bottom: 10px;
  gap: 8px;
  display: flex;
`;

export const MovementListFilters = styled.div`
  width: 50%;
  margin-top: 20px;
  margin-bottom: 10px;
  gap: 8px;
  display: flex;
`;

export const DropdownWrapper = styled.div`
  width: 50%;
`;
