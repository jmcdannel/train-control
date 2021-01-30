import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Loading from '../Shared/Loading/Loading';
import ApiError from '../Shared/ApiError/ApiError';
import api, { apiStates } from '../Api';
import { getConfig } from '../config/config';
import Turnout from './Turnout';

import { Context } from '../Store/Store';

export const Turnouts = props => {

  const appConfig = getConfig();
  const layoutId = appConfig.layoutId;

  const { view, filter, groupBy } = props;

  const [ state, dispatch ] = useContext(Context);
  const { turnouts } = state;
  const [turnoutsStatus, setTurnoutsStatus] = useState(apiStates.idle);

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnoutsStatus(apiStates.pending);
      try {
        const payload = await api.turnouts.get();
        await dispatch({ type: 'UPDATE_TURNOUTS', payload });
        setTurnoutsStatus(apiStates.done)
      } catch(err) {
        console.error(err);
        setTurnoutsStatus(apiStates.error)
      }
    }
    if (layoutId && (turnouts && turnouts.length === 0) && turnoutsStatus === 'idle') {
      fetchTurnouts();
    }
  }, [turnouts, turnoutsStatus, layoutId]);

  const getTurnoutById = id => turnouts.find(t => id === t.turnoutId);

  const getLines = () => filter(turnouts).reduce((acc, curr) => {
    if (!acc.includes(curr.line)) {
      acc.push(curr.line);
    }
    return acc;
  }, []);

  const getSections = () => filter(turnouts).reduce((acc, curr) => {
    if (!acc.includes(curr.section)) {
      acc.push(curr.section);
    }
    return acc;
  }, []);


  return (
    <Grid container className={`turnouts turnouts--${view}`}>
      {(turnoutsStatus === apiStates.idle || turnoutsStatus === apiStates.pending) && (
        <Loading />
      )}
      {turnoutsStatus === apiStates.error && (
        <ApiError />
      )}
      {turnoutsStatus === apiStates.done && turnouts && turnouts.length > 0 && (
        <>
        {groupBy === '' && (
          <Grid item sm={12} className="turnout__grid-item">
            {filter(turnouts).map(turnout => (
              <div key={turnout.turnoutId} className="turnout__container">
                <Turnout config={turnout} />
              </div>
            ))}
          </Grid>
        )}
        {groupBy === 'line' && getLines().map(line => (
          <>
            <Grid item sm={12} className="turnout__grid-item">
              <h3>{line}</h3>
            </Grid>
            <Grid item sm={12} className="turnout__grid-item">
              {filter(turnouts.filter(t => t.line === line)).map(turnout => (
                <div key={turnout.turnoutId} className="turnout__container">
                  <Turnout config={turnout} />
                </div>
              ))}
            </Grid>
          </>
        ))}
        {groupBy === 'board' && getSections().map(section => (
          <>
            <Grid item sm={12} className="turnout__grid-item">
              <h3>{section}</h3>
            </Grid>
            <Grid item sm={12} className="turnout__grid-item">
              {filter(turnouts.filter(t => t.section === section)).map(turnout => (
                <div key={turnout.turnoutId} className="turnout__container">
                  <Turnout config={turnout} />
                </div>
              ))}
            </Grid>
          </>
        ))}
        </>
      )}
    </Grid>
    
  );

}

Turnouts.defaultProps = {
  enableMenu: true, 
  initialView: 'compact',
  filter: turnouts => turnouts
};

export default Turnouts;