import React, { useState } from 'react';
import Throttle from './Throttle';

export const Throttles = props => {

  const handleThrottleChange = e => {
    console.log('handleThrottleChange', e);
  }

  return (
    <div className="throttles">
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
      <div className="throttle__container">
        <Throttle engine="" initialState="" onChange={handleThrottleChange} />
      </div>
    </div>
  );

}

export default Throttles;