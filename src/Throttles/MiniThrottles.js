import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import Box from '@material-ui/core/Box';
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
            <Box display="flex" flexDirection="row"  flexWrap="wrap" >
              {locos.map(loco => (
                <Box key={loco.address}>
                  <MiniThrottle loco={loco} jmriApi={jmriApi} onLocoClick={onLocoClick} />
                </Box>
              ))}
            </Box>
          )}
        </Route>
    </Switch>
  )

}

export default MiniThrottles;
