import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Throttle from './Throttle';
import FullThrottle from './FullThrottle';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Context } from '../Store/Store';
import jmriApi from '../Shared/jmri/jmriApi';

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

  useEffect(() => {
    jmriApi.on('acquire', 'Throttles', handleLocoAcquired);
  }, [jmriApi, handleLocoAcquired]);

  console.log('locos', locos);

  return (
    <Grid 
      container 
      // spacing={2} 
      className="throttles" 
      alignItems="flex-start"
      alignContent="flex-start"
    >
      <Grid 
        item 
        className="throttles__menu" 
        xs={12}
        container 
        direction="row"
        justify="space-between"
        alignItems="flex-start">
        <Grid item>
          <ButtonGroup 
            orientation="horizontal"
            variant="outlined"
            className="width100"
            color="primary">
            {locos.filter(loco => !loco.isAcquired).map(loco => 
              <Button 
                key={loco.address}
                onClick={() => acquireLocoClicked(loco.address)}
              >
                {loco.address}
              </Button>
            )}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid item xs={12} className={`throttles__acquired  throttles__acquired--view-comfy grow`}>
      
        {locos.filter(loco => loco.isAcquired).map(loco => 
          <div className="throttle__container" key={loco.address}>
            <Throttle jmriApi={jmriApi} loco={loco} />
          </div>
        )}
        
      </Grid>
    </Grid>
  );

}

export default Throttles;