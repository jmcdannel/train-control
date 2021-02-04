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

  const lines = filter(turnouts).reduce((acc, curr) => {
    if (!acc.includes(curr.line)) {
      acc.push(curr.line);
    }
    return acc;
  }, []);

  const sections = filter(turnouts).reduce((acc, curr) => {
    if (!acc.includes(curr.section)) {
      acc.push(curr.section);
    }
    return acc;
  }, []);

  return (
    <Grid container className={`turnouts turnouts--${view}`}>
      {groupBy === '' && (
        <Grid item sm={12} className="turnout__grid-item">
          {turnouts.map(turnout => (
            <div key={`turnout${groupBy}${turnout.turnoutId}`} className="turnout__container">
            {console.log('none', turnout, turnout.turnoutId)}
              <Turnout config={turnout} />
            </div>
          ))}
        </Grid>
      )}
      {groupBy === 'line' && lines.map(line => (
        <>
          <Grid item sm={12} className="turnout__grid-item">
            <h3>{line}</h3>
          </Grid>
          <Grid item sm={12} className="turnout__grid-item">
            {turnouts.filter(t => t.line === line).map(turnout => (
              <div key={`turnout${groupBy}${turnout.turnoutId}`} className="turnout__container">
              {console.log('line', turnout, turnout.turnoutId)}
                <Turnout config={turnout} />
              </div>
            ))}
          </Grid>
        </>
      ))}
      {groupBy === 'board' && sections.map(section => (
        <>
          <Grid item sm={12} className="turnout__grid-item">
            <h3>{section}</h3>
          </Grid>
          <Grid item sm={12} className="turnout__grid-item">
            {turnouts.filter(t => t.section === section).map(turnout => (
              <div key={`turnout${groupBy}${turnout.turnoutId}`} className="turnout__container">
                {console.log('board', `turnout${groupBy}${turnout.turnoutId}`, turnout.turnoutId)}
                <Turnout config={turnout} />
              </div>
            ))}
          </Grid>
        </>
      ))}
    </Grid>
    
  );

}

Turnouts.defaultProps = {
  initialView: 'compact',
  groupBy: '',
  filter: turnouts => turnouts
};

export default Turnouts;