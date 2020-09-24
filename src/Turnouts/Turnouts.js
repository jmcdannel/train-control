import React from 'react';
import Grid from '@material-ui/core/Grid';
import Turnout from './Turnout';

export const Turnouts = props => {

  const { turnoutList, onChange } = props;

  const getTurnoutById = id => turnoutList.find(t => id === t.turnoutId);

  const getLinkedTurnout = turnout => 
    turnout.crossover
      ? getTurnoutById(turnout.crossover)
      : turnout.reverse
        ? getTurnoutById(turnout.reverse)
        : null;

  return (
    <Grid container spacing={2}>
      {turnoutList && turnoutList.map(turnout => (
      <Grid key={turnout.turnoutId} item>
          <Turnout 
            config={turnout} 
            linked={getLinkedTurnout(turnout)}
            onChange={onChange} />
      </Grid>
      ))}
    </Grid>
  );

}

export default Turnouts;