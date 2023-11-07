import React from 'react';
import Lottie from 'lottie-react';
import Construction from './Construction.json';

const Animation = () => {
  return (
    <div>
      <Lottie
        animationData={Construction}
        autoplay={true}
        loop={true}
        style={{width: 400, height: 400, opacity: 0.15}}
      />
    </div>
  );
};

export default Animation;
