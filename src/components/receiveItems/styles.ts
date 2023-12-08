import {Input, Typography} from 'client-library';
import styled from 'styled-components';

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;
export const AmountInput = styled(Input)`
  width: 80px;
  border-radius: 8px;
`;

export const Title = styled(Typography)`
  font-weight: 600;
  margin-bottom: 12px;
`;

export const HeaderSection = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 25px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 20px;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 25px;
`;

export const DatepickersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  margin-bottom: 25px;
`;

export const TextareaWrapper = styled.div`
  height: 100%;
`;
