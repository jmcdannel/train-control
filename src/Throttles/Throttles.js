import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Throttle from './Throttle';
import Button from '@material-ui/core/Button';
import { Context } from '../Store/Store';

export const Throttles = props => {

  const [ state, dispatch ] = useContext(Context);
  const { jmriApi } = props;

  const views = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfy', value: 'comfy' },
    { label: '2 Up', value: '2up' },
    { label: 'Full', value: 'full' },
  ]

  const [view, setView] = useState(window.localStorage.getItem('throttleView') || views[1].value);

  const acquireLocoClicked = async address => {
    await jmriApi.requestLoco(address);
  }

  const handleLocoAcquired = address => {
    dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true } });
    jmriApi.off('acquire', 'Throttles');
  }

  const handleSpeed = ({ name, speed }) => {
    dispatch({ type: 'UPDATE_LOCO', payload: { address: name, speed } });
    jmriApi.off('speed', 'Throttles');
  }

  const handleDirection = async ({ name, forward }) => {
    dispatch({ type: 'UPDATE_LOCO', payload: { address: name, forward } });
    jmriApi.off('direction', 'Throttles');
  }

  useEffect(() => {
      jmriApi.on('direction', 'Throttles', handleDirection);
      jmriApi.on('speed', 'Throttles', handleSpeed);
      jmriApi.on('acquire', 'Throttles', handleLocoAcquired);
  }, [jmriApi, handleDirection, handleSpeed]);

  const handleViewClick = view => {
    setView(view);
    window.localStorage.setItem('throttleView', view);
  }

  return (
    <Grid container spacing={2} className="throttles">
      <Grid item xs={1} className="throttles__available">
        <Grid container spacing={1}>

          {state.locos.filter(loco => !loco.isAcquired).map(loco => 
            <Grid item key={loco.address}>
              <Button 
                variant="outlined"
                color="primary"
                key={loco.address}
                onClick={() => acquireLocoClicked(loco.address)}
              >{loco.address}
              </Button>
            </Grid>
          )}
          <Grid item className="throttles__menu">
            <Paper>
              <MenuList>
                {views.map(view => (
                  <MenuItem key={view.value} onClick={() => handleViewClick(view.value)}>{view.label}</MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={11} className={`throttles__acquired  throttles__acquired--view-${view}`}>
        {state.locos.filter(loco => loco.isAcquired).map(loco => 
          <div className="throttle__container" key={loco.address}>
            <Throttle jmriApi={jmriApi} loco={loco} />
          </div>
        )}
      </Grid>
    </Grid>
  );

}

export default Throttles;