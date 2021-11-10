import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Throttle from './Throttle';
import MiniThrottles from './MiniThrottles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TrainIcon from '@material-ui/icons/Train';
import { Context } from '../Store/Store';
import jmriApi from '../Shared/jmri/jmriApi';

import './Throttles.scss';

export const Throttles = props => {

  const [ state, dispatch ] = useContext(Context);
  // const { jmriApi } = props;
  const { locos } = state;
  
  const acquireLocoClicked = async address => {
    await jmriApi.requestLoco(address);
  }

  const handleLocoAcquired = address => {
    dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true } });
  }

  const handleCruiseControlLocoClicked = loco => {
    console.log('handleCruiseControlLocoClicked', loco);
  }

  const handleThrottleLocoClicked = loco => {
    console.log('handleCruiseControlLocoClicked', loco);
  }

  useEffect(() => {
    jmriApi.on('acquire', 'Throttles', handleLocoAcquired);
  }, [jmriApi, handleLocoAcquired]);

  console.log('locos', locos, state);

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Box 
        flexGrow={1} 
        display="flex" 
        flexDirection="row" 
        className={`throttles__acquired  throttles__acquired--view-comfy`}>
        {locos.filter(loco => loco.isAcquired && !loco.cruiseControl).map(loco => 
            <Throttle key={loco.address} jmriApi={jmriApi} loco={loco} onLocoClick={handleThrottleLocoClicked} />
        )}        
      </Box>
      <Box className={`throttles__cruise-control`}>
        <MiniThrottles locos={locos.filter(loco => loco.isAcquired && loco.cruiseControl)} jmriApi={jmriApi} onLocoClick={handleCruiseControlLocoClicked} />
      </Box>
      <Box className="throttles__unaquired">
        <MiniThrottles locos={locos.filter(loco => !loco.isAcquired)} jmriApi={jmriApi} onLocoClick={loco => acquireLocoClicked(loco.address)} />
      </Box>
    </Box>
  );

}

export default Throttles;