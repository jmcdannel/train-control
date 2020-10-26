import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';
import { apiStates } from '../Api';

const initialState = {
  layout: null,
  layoutStatus: apiStates.idle,
  locos: [
    {
      address: 31,
      name: "BNSF5931",
      road: "BNSF",
      isAcquired: false,
      speed: 0,
      forward: null,
      idleByDefault: true
    },
    {
      address: 3,
      name: "GN-317",
      road: "Great Northern",
      isAcquired: false,
      speed: 0,
      forward: null,
      idleByDefault: true
    }
  ],
  turnouts: [],
  signals: [],
  sounds: null,
  menu: {
    turnouts: {
      view: 'compact'
    }
  },
  userPreferences: {}
};

const Store=({children})=>{
  const [ state, dispatch ] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}

export const Context = createContext(initialState);

export default Store;
