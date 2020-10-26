import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PanToolIcon from '@material-ui/icons/PanTool';
import MiniThrottle from './MiniThrottle';
import './MiniThrottles.scss';

export const MiniThrottles = ({ locos, jmriApi }) => {

  const filteredLocos = locos
    .filter(loco => loco.isAcquired && (loco.speed !== 0 || loco.isPinned));

  return (
    
    <Switch>
      <Route
        path="/throttles"></Route>
      <Route
        path="/">
          {filteredLocos.length && (
            <Grid container className="mini-throttles" alignContent="flex-end">
              <Grid item xs={10} className="flex" className="mini-throttles__wrapper">
                {filteredLocos.map(loco => (
                  <MiniThrottle key={loco.address} loco={loco} jmriApi={jmriApi} />
                ))}
              </Grid>
              <Grid item xs={2} className="mini-throttles__stop">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PanToolIcon />}
                >
                  Stop All
                </Button>
              </Grid>
            </Grid>
          )}
        </Route>
    </Switch>
  )

}

export default MiniThrottles;
