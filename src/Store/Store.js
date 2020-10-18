import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';
import MenuContext from '../Shared/Context/MenuContext';

const initialState = {
  locos: [
    {
      address: 3,
      name: "GN-317",
      road: "Great Northern",
      isAcquired: false,
      speed: 0
    }
  ]
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
