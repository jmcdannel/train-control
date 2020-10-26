import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { MenuContext } from '../Shared/Context/MenuContext';
import Loading from '../Shared/Loading/Loading';
import ApiError from '../Shared/ApiError/ApiError';
import { apiStates } from '../Api';
import Turnout from './Turnout';

export const Turnouts = props => {

  const { turnouts, turnoutsStatus, onChange } = props;

  const menu = useContext(MenuContext);
  const isCompact = menu
    && menu.view === 'compact' ? true : false;

  const getTurnoutById = id => turnouts.find(t => id === t.turnoutId);

  const getLinkedTurnout = turnout => 
    turnout.crossover
      ? getTurnoutById(turnout.crossover)
      : turnout.reverse
        ? getTurnoutById(turnout.reverse)
        : null;
  return (
    <Grid container spacing={2} className={`turnouts turnouts--tiny`}>
    {/* <Grid container spacing={2} className={`turnouts ${isCompact ? 'turnouts--compact' : 'turnouts--comfy'}`}> */}
      {(turnoutsStatus === apiStates.idle || turnoutsStatus === apiStates.pending) && (
        <Loading />
      )}
      {turnoutsStatus === apiStates.error && (
        <ApiError handleEmulatorClick={() => console.log('Not Implemented')} />
      )}
      {turnoutsStatus === apiStates.done && turnouts && turnouts.length > 0 && turnouts.map(turnout => (
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