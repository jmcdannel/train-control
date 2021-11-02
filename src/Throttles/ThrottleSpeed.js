import React from 'react';

export const ThrottleSpeed = props => {

  const { speed, isDisabled = false } = props;

  return (
    <div className={`throttle__speed 
      ${isDisabled ? 'throttle__speed--disabled' : ''}
      ${speed < 0 
        ? 'throttle__speed--reverse' 
        : 'throttle__speed--forward'}`}>
      {Math.abs(parseInt(speed))}
    </div>
  );

}

export default ThrottleSpeed;