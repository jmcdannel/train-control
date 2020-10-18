import React from 'react';

export const throttleConfig = [
  {
    address: "3",
    name: "GN-317",
    road: "Great Northern",
    isRegistered: false,
    speed: 0
  }
];

export const ThrottleContext = React.createContext(throttleConfig);

export default ThrottleContext;
