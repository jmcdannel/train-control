import React, { useState } from 'react';
import Throttle from './Throttle';

export const Throttles = props => {

  const handleThrottleChange = e => {
    console.log('handleThrottleChange', e);
  }

  return (
    <Throttle engine="" initialState="" onChange={handleThrottleChange} />
  );

}

export default Throttles;