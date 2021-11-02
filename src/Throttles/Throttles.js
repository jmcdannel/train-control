import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
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
    <Grid 
      container 
      className="throttles" 
      direction="column"
      alignItems="flex-start"
      alignContent="flex-start"
      spacing={1}
    >
      <Grid item className={`throttles__acquired  throttles__acquired--view-comfy grow`}>
      
        {locos.filter(loco => loco.isAcquired && !loco.cruiseControl).map(loco => 
          <div className="throttle__container" key={loco.address}>
            <Throttle jmriApi={jmriApi} loco={loco} onLocoClick={handleThrottleLocoClicked} />
          </div>
        )}
        
      </Grid>
      <Grid item className={`throttles__cruise-control grow`}>
        <MiniThrottles locos={locos.filter(loco => loco.isAcquired && loco.cruiseControl)} jmriApi={jmriApi} onLocoClick={handleCruiseControlLocoClicked} />
      </Grid>

      <Grid item className="throttles__unaquired grow">
        <MiniThrottles locos={locos.filter(loco => !loco.isAcquired)} jmriApi={jmriApi} onLocoClick={loco => acquireLocoClicked(loco.address)} />
      </Grid>

    </Grid>
  );

}

export default Throttles;