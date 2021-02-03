import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { Context } from '../Store/Store';
import Effect from './Effect';

export const Effects = props => {

  
  const [ state, dispatch ] = useContext(Context);
  // const { jmriApi } = props;
  const { effects, sensors } = state;

  return (
    <Grid container className={`effects`}>
      <Grid item className="effects__grid-item">
        {effects.map(effect => (
          <div className="effects__container" key={effect.effectId}>
            <Effect effect={effect} sensors={sensors} />
          </div>
        ))}
      </Grid>
    </Grid>    
  );

}

export default Effects;