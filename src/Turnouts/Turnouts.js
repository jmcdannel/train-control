import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { MenuContext } from '../Shared/Context/MenuContext';
import Turnout from './Turnout';

export const Turnouts = props => {

  const { turnoutList, onChange } = props;

  const menu = useContext(MenuContext);
  const isCompact = menu
    && menu.view === 'compact' ? true : false;

  const getTurnoutById = id => turnoutList.find(t => id === t.turnoutId);

  const getLinkedTurnout = turnout => 
    turnout.crossover
      ? getTurnoutById(turnout.crossover)
      : turnout.reverse
        ? getTurnoutById(turnout.reverse)
        : null;
  return (
    <Grid container spacing={2} className={`turnouts ${isCompact ? 'turnouts--compact' : 'turnouts--comfy'}`}>
      {turnoutList && turnoutList.map(turnout => (
      <Grid key={turnout.turnoutId} item className="turnout__container">
          <Turnout 
            compact={isCompact}
            config={turnout} 
            linked={getLinkedTurnout(turnout)}
            onChange={onChange} />
      </Grid>
      ))}
    </Grid>
  );

}

export default Turnouts;