import React, {ReactElement} from 'react';
import styled from 'styled-components';
import {Button, Typography} from 'client-library';
import {ScreenProps} from '../types/screen-props';
import useAppContext from '../context/useAppContext';

const Container = styled.div<{children: ReactElement | ReactElement[]}>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  height: 100%;
  padding: 50px;
`;

const TextCenter = styled(Typography)`
  text-align: center;
`;

export const NotFound404: React.FC = () => {
  const {navigation} = useAppContext();
  return (
    <Container id="not-found-404">
      <TextCenter content="Oops! 404 not found" variant={'h1'} />
      <TextCenter
        content="Looks like you've wandered off the beaten path and landed in the land of lost web pages. Don't worry, we've sent out a search party to retrieve the missing page and bring it back to its rightful place. In the meantime, why not take a breather and enjoy the view? We hear the pixels in this neck of the woods are particularly vibrant."
        variant="bodyMedium"
      />
      <Button content="Go back" onClick={() => navigation.navigate('/')} />
    </Container>
  );
};
