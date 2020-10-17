import React from 'react';

export const ThrottleSpeed = props => {

  const { speed } = props;

  return (
    <div className={`throttle__speed 
      ${speed < 0 
        ? 'throttle__speed--reverse' 
        : 'throttle__speed--forward'}`}>
      {Math.abs(parseInt(speed))}
    </div>
  );

}

export default ThrottleSpeed;