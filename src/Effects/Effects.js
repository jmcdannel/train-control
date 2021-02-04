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

/*
red: 32
yellow: 33
green: 34

red: 35
yellow: 36
green: 37

red: 38
yellow: 39
green: 40

red: 22
yellow: 23
green: 24

red: 25
yellow: 26
green: 27

*/

Effects.defaultProps = {
  initialView: 'compact',
  groupBy: '',
  filter: turnouts => turnouts
};

export default Effects;