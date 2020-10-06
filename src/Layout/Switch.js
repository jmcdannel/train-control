import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CallSplit from '@material-ui/icons/CallSplit';
import { ReactComponent as Turnout4Diverge } from '../Shared/Images/TurnoutMasks/4-divergent.svg';
import { ReactComponent as Turnout4Straight } from '../Shared/Images/TurnoutMasks/4-straight.svg';

import api from '../Api';

import './Switch.scss';


function TurnoutSwitch(props) {

  const { config, linked: linkedTurnout, onChange  } = props;
  const { relay, crossover, reverse, name, turnoutId, label, line, abbr, current, straight, divergent, 'default': defaultOrientation } = config;

  const [isDivergent, setIsDivergent] = useState(config.current === config.divergent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsDivergent((current === divergent));
  }, [current, straight, divergent]);

  const handleClick = async () => {
    if (isLoading) { 
      return;
    }
    try {
      const data = [{ turnoutId, current: isDivergent ? straight : divergent }];
      setIsLoading(true);
      if (false && linkedTurnout) {
        data.push({
          turnoutId: linkedTurnout.turnoutId,
          current: isDivergent 
            ? linkedTurnout.straight 
            : linkedTurnout.divergent
        })
      }
      await onChange(data);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }


  return (
      <div className={`switch switch-${turnoutId} box no-cursor`}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<CallSplit />}
          onClick={handleClick}
          className="cursor switch-button"
        >
          <strong>{label}</strong>
        </Button>
        <Turnout4Diverge className={`diverge-mask diverge-mask--${isDivergent ? 'off' : 'on'}`} />
        <Turnout4Straight className={`straight-mask straight-mask--${isDivergent ? 'on' : 'off'}`} />
      </div>
  );
}

export default TurnoutSwitch;
