import styled from 'styled-components';

export const ParentContainer = styled.div`
  background-color: rgba(174, 60, 24, 0.2);
  position: absolute;
  top: 0;
  right: 0;
  width: calc(100vw - 350px);
  height: 100%;
`;

export const RedDiv = styled.div`
  height: 40%;
  display: flex;
  background-color: rgba(174, 60, 24, 0.79);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 65%, 0% 100%);
  clip-path: polygon(0 0, 100% 0, 100% 65%, 0% 100%);
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  h1,
  h6 {
    margin: 0;
  }

  h1 {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 2px;
    font-size: 36px;
  }

  h6 {
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 1px;
    font-size: 10px;
  }
`;

export const AnimationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
