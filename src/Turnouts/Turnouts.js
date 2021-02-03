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

  const { view, filter, groupBy } = props;

  const [ state, dispatch ] = useContext(Context);
  const { turnouts } = state;

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

  const groupHeader = title => (
    <Grid item sm={12} className="turnout__grid-item">
      <h3>{title}</h3>
    </Grid>
  );


  return (
    <Grid container className={`turnouts turnouts--${view}`}>
      {/* {(turnoutsStatus === apiStates.idle || turnoutsStatus === apiStates.pending) && (
        <Loading />
      )}
      {turnoutsStatus === apiStates.error && (
        <ApiError />
      )}
      {turnoutsStatus === apiStates.done && turnouts && turnouts.length > 0 && ( */}
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
            {groupHeader(line)}
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
            {groupHeader(section)}
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
      {/* )} */}
    </Grid>
    
  );

}

Turnouts.defaultProps = {
  enableMenu: true, 
  initialView: 'compact',
  groupBy: '',
  filter: turnouts => turnouts
};

export default Turnouts;