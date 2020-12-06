import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Loading from '../Shared/Loading/Loading';
import ApiError from '../Shared/ApiError/ApiError';
import { apiStates } from '../Api';
import Signal from './Signal';

export const Signals = props => {

  const { signals, signalsStatus, sensors, sensrosStatus } = props;

  return (
    <Grid container className={`signals`}>
      {(signalsStatus === apiStates.idle || signalsStatus === apiStates.pending) && (
        <Loading />
      )}
      {signalsStatus === apiStates.error && (
        <ApiError />
      )}
      {signalsStatus === apiStates.done && signals && signals.length > 0 && (
        <Grid item className="signals__grid-item">
          {signals.map(signal => (
            <div className="signals__container" key={signal.signalId}>
              <Signal signal={signal} sensors={sensors} />
            </div>
          ))}
        </Grid>
      )}
    </Grid>
    
  );

}

export default Signals;