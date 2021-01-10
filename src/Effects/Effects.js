import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Loading from '../Shared/Loading/Loading';
import ApiError from '../Shared/ApiError/ApiError';
import { apiStates } from '../Api';
import Effect from './Effect';

export const Effects = props => {

  const { effects, effectsStatus, sensors, sensrosStatus } = props;

  return (
    <Grid container className={`effects`}>
      {(effectsStatus === apiStates.idle || effectsStatus === apiStates.pending) && (
        <Loading />
      )}
      {effectsStatus === apiStates.error && (
        <ApiError />
      )}
      {effectsStatus === apiStates.done && effects && effects.length > 0 && (
        <Grid item className="effects__grid-item">
          {effects.map(effect => (
            <div className="effects__container" key={effect.effectId}>
              <Effect effect={effect} sensors={sensors} />
            </div>
          ))}
        </Grid>
      )}
    </Grid>
    
  );

}

export default Effects;