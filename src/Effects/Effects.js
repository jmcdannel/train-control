import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { Context } from '../Store/Store';
import Effect from './Effect';
import './Effects.scss';

export const Effects = props => {

  const { view, filter, groupBy } = props;

  const [ state, dispatch ] = useContext(Context);
  const { effects, sensors } = state;
  const isSmallView = (view === 'pill' || view === 'tiny');

  return (
    <Grid container className={`effects  effects--${view}`} spacing={2}>  
      {effects.map(effect => (
        <Grid key={`effect${effect.effectId}`} item className="effects__grid-item" xs={isSmallView ? 4 : 6}>
            <Effect effect={effect} sensors={sensors} view={view} key={effect.effectId} />
        </Grid>
      ))}
    </Grid>    
  );

}

Effects.defaultProps = {
  initialView: 'compact',
  groupBy: '',
  filter: turnouts => turnouts
};

export default Effects;