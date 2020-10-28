import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Throttle from './Throttle';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Context } from '../Store/Store';

export const Throttles = props => {

  const [ state, dispatch ] = useContext(Context);
  const { jmriApi } = props;

  const views = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfy', value: 'comfy' },
    { label: '2 Up', value: '2up' },
    { label: 'Full', value: 'full' },
  ];

  const [view, setView] = useState(window.localStorage.getItem('throttleView') || views[1].value);

  const acquireLocoClicked = async address => {
    await jmriApi.requestLoco(address);
  }

  const handleLocoAcquired = address => {
    dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true } });
  }

  useEffect(() => {
    jmriApi.on('acquire', 'Throttles', handleLocoAcquired);
  }, [jmriApi, handleLocoAcquired]);

  const handleViewClick = event => {
    setView(event.target.value);
    window.localStorage.setItem('throttleView', event.target.value);
  }

  return (
    <Grid container spacing={2} className="throttles">
      <Grid item className="throttles__available" zeroMinWidth>
        <Grid container spacing={1} direction="column" className="throttles__menu">
          <Grid item>
            <ButtonGroup 
              orientation="vertical"
              variant="outlined"
              className="width100"
              color="primary">
              {state.locos.filter(loco => !loco.isAcquired).map(loco => 
                <Button 
                  key={loco.address}
                  key={loco.address}
                  onClick={() => acquireLocoClicked(loco.address)}
                >
                  {loco.address}
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          <Grid item className="throttles__viewmenu">
              <FormControl >
                <InputLabel shrink id="view-throttles-label">
                  View
                </InputLabel>
                <Select
                  labelId="view-throttles-label"
                  id="view-throttles"
                  value={view}
                  onChange={handleViewClick}
                  displayEmpty
                >
                  {views.map(view => (
                    <MenuItem key={view.value} value={view.value}>{view.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={`throttles__acquired  throttles__acquired--view-${view} grow`}>
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