import React from 'react';
import {AnimationWrapper, ParentContainer, RedDiv, Title} from '../components/landingPage/styles';
import Animation from '../components/landingPage/animation';

const ACCOUNTING: React.FC = () => {
  return (
    <ParentContainer>
      <RedDiv>
        <Title>
          <h1>MATERIJALNO KNJIGOVODSTVO</h1>
        </Title>
      </RedDiv>
      <AnimationWrapper>
        <Animation />
      </AnimationWrapper>
    </ParentContainer>
  );
};

export default ACCOUNTING;
