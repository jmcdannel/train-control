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

export const MiniThrottles = ({ locos, jmriApi, onLocoClick, showStop = false }) => {

  return (
    <Switch>
      <Route path="/throttles"></Route>
      <Route
        path="/">
          {locos.length && (
            <Grid container className="mini-throttles" spacing={2}>
              <Grid item xs={showStop ? 10 : 12} className="flex" className="mini-throttles__wrapper">
                {locos.map(loco => (
                  <MiniThrottle key={loco.address} loco={loco} jmriApi={jmriApi} onLocoClick={onLocoClick} />
                ))}
              </Grid>
              {showStop && (
                <Grid item xs={2} className="mini-throttles__stop">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PanToolIcon />}
                  >
                    Stop All
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Route>
    </Switch>
  )

}

export default MiniThrottles;
