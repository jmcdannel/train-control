import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Loading from '../Shared/Loading/Loading';
import ApiError from '../Shared/ApiError/ApiError';
import { apiStates } from '../Api';
import Turnout from './Turnout';

export const Turnouts = props => {

  const { turnouts, turnoutsStatus } = props;

  const views = [
    { label: 'Tiny', value: 'tiny' },
    { label: 'Compact', value: 'compact' },
    { label: 'Comfy', value: 'comfy' },
  ];
  const [view, setView] = useState(window.localStorage.getItem('turnoutView') || 'compact');

  const handleViewClick = event => {
    setView(event.target.value);
    window.localStorage.setItem('throttleView', event.target.value);
  }

  const getTurnoutById = id => turnouts.find(t => id === t.turnoutId);

  return (
    <Grid container className={`turnouts turnouts--${view}`}>
      {(turnoutsStatus === apiStates.idle || turnoutsStatus === apiStates.pending) && (
        <Loading />
      )}
      {turnoutsStatus === apiStates.error && (
        <ApiError />
      )}
      {turnoutsStatus === apiStates.done && turnouts && turnouts.length > 0 && (
        <>
          <Grid item zeroMinWidth>
            <FormControl >
              <InputLabel shrink id="view-turnouts-label">
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
          </Grid >
          <Grid item className="turnout__grid-item">
            {turnouts.map(turnout => (
              <div className="turnout__container">
                <Turnout 
                  config={turnout} 
                 />
              </div>
            ))}
          </Grid>
        </>
      )}
    </Grid>
    
  );

}

export default Turnouts;