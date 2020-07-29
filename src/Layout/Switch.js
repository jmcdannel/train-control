import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CallSplit from '@material-ui/icons/CallSplit';
import api from '../Api';

import './Switch.scss';


function TurnoutSwitch(props) {

  const { config, linked: linkedTurnout, onChange  } = props;
  const { relay, crossover, reverse, name, id, label, line, abbr, current, straight, divergent, 'default': defaultOrientation } = config;

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
      const data = [{ id, current: isDivergent ? straight : divergent }];
      setIsLoading(true);
      if (linkedTurnout) {
        data.push({
          id: linkedTurnout.id,
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
      <div className={`switch switch-${id} box no-cursor`}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<CallSplit />}
          onClick={handleClick}
          className="cursor"
        >
          <strong>{label}</strong>
        </Button>
  
        <span className={`straight-indicator straight-indicator--${isDivergent ? 'off' : 'on'}`}></span>
        <span className={`divergent-indicator divergent-indicator--${isDivergent ? 'on' : 'off'}`}></span>
      </div>
  );
}

export default TurnoutSwitch;
