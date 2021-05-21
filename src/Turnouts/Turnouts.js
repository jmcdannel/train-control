import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Turnout from './Turnout';
import MapTurnout from './MapTurnout';
import tamarackStationSouthImage from '../Layout/images/tam/tamarack-station-south.png';
import { ReactComponent as Turnout4Left } from '../Shared/Images/TurnoutMasks/4-left.svg';

import { Context } from '../Store/Store';
import api from '../Api';

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
                <Turnout config={turnout} />
              </div>
            ))}
          </Grid>
          <Grid item sm={12} className="turnout__grid-item">
            

            <div className="turnout__layout">
              <img src={tamarackStationSouthImage} />
              {/* <button className="turnout__layout__switch turnout__layout__switch--ts10 turnout__layout__switch--ts10--divergent"><Turnout4Left className="turnout__layout__switch__img" /></button> */}
              {turnouts.filter(t => t.section === section).map(turnout => (
                <MapTurnout key={`mapturnout${groupBy}${turnout.turnoutId}`} config={turnout} />
              ))}
              
              
            </div>
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