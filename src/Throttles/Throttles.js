import React, { useState, useEffect } from 'react';
import Throttle from './Throttle';
import throttleApi from './ThrottleApi';

export const Throttles = () => {

  const [initialized, setIinitialized] = useState(false);

  useEffect(() => {
    const  setup = async () => {
      const isSetup = await throttleApi.setup();
      setIinitialized(isSetup);
    }
    if (!initialized) {
      setup();
    }
  }, [initialized]);

  const loco1 = {
    address: "3",
    name: "GN-317",
    road: "Great Northern"
  };


  return (
    <div className="throttles">
      {initialized && (
        <div className="throttle__container">
          <Throttle throttleApi={throttleApi} loco={loco1} />
        </div>
      )}
    </div>
  );

}

export default Throttles;