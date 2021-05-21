import React, { useState, useEffect, useContext } from 'react';
import * as Colors from 'material-ui/colors';
// import SwitchImg from './switch.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Settings from './Settings';
import { ReactComponent as Turnout4Left } from '../Shared/Images/TurnoutMasks/4-left.svg';
import { Context } from '../Store/Store';
import api from '../Api';
import './Turnout.scss';
// import { linesConfig } from '../Api';


export const linesConfig = [
  { lineId: 'Mainline Red', label: 'Mainline SB', color: Colors.red[500] },
  { lineId: 'Mainline Green', label: 'Mainline NB', color: Colors.green[500] },
  { lineId: 'Tamarack Station', label: 'Tamarack Station North', color: Colors.cyan[500] }
];


export const MapTurnout = props => {

  const { config } = props;
  
  const [ state, dispatch ] = useContext(Context);

  const [isDivergent, setIsDivergent] = useState(config.current === config.divergent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const { current, turnoutId, straight, divergent, section, 'default': defaultOrientation } = config;

  useEffect(() => {
    setIsDivergent((current === divergent));
  }, [current, straight, divergent]);

  const handleToggle = async e => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      setIsPristine(false);
      const turnout = await api.turnouts.put({ turnoutId, current: isDivergent ? straight : divergent });
      await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
    
  }

	return (
    
    <button
      onClick={handleToggle} 
      className={`turnout__layout__switch turnout__layout__switch--${section.replace(/\s+/g, '-').toLowerCase()} turnout__layout__switch--${turnoutId} turnout__layout__switch--${isDivergent ? 'divergent' : 'straight'}`}>
        <Turnout4Left className="turnout__layout__switch__img" />
    </button>
	)

}

export default MapTurnout;