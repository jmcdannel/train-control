import React, { useContext } from 'react';
import Throttle from './Throttle';
import { Context } from '../Store/Store';

export const Throttles = props => {

  const [ state, dispatch ] = useContext(Context);
  const { jmriApi } = props;

  
  // const handleRegisterLoco = loco => {
  //   console.log('handleRegisterLoco', loco, throttles);
  //   if (!throttles.includes(loco)) {
  //     loco.isRegistered = true;
  //     throttles.push(loco);
  //   }
  // }

  return (
      <div className="throttles">
        <div className="throttle__container">
          {state.locos.map(loco => {

            return (<Throttle 
              key={loco.address}
              jmriApi={jmriApi} 
              loco={loco} 
            />);

          })}
        </div>
      </div>
  );

}

export default Throttles;