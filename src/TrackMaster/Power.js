import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const powerStates = {
  unknown: 0, 
  on: 2, 
  off: 4
};

export const Power = props => {

  const { jmriApi, jmriReady } = props;

  const [ powerStatus, setPowerStatus ] = useState(powerStates.unknown);
  const [ initialized, setInitialized ] = useState(false);

  useEffect(() => {
    if (jmriReady && !initialized) {
      jmriApi.on('power', handlePowerStateChange);
      jmriApi.power();
      setInitialized(true);
    }
  }, [ initialized, jmriReady, jmriApi ]);

  const handlePowerStateChange = state => {
    setPowerStatus(state);
  }

  const handlePowerClick = () => {
    if (powerStatus === powerStates.unknown || powerStatus === powerStates.off) {
      jmriApi.power(powerStates.on);
    } else if (powerStatus === powerStates.on) {
      jmriApi.power(powerStates.off);
    }
  }

  const getCurrentStateKey = () => {
    const currState = Object.keys(powerStates)
      .filter(key => powerStates[key] === powerStatus);
    return currState.length ? currState[0] : 'unknown';
  }

  const getClassName = () => jmriApi.getState().ready && initialized
      ? `power-${getCurrentStateKey()}`
      : 'power-pending';

  return (
    <IconButton onClick={handlePowerClick} className={getClassName()}>
      <PowerSettingsNewIcon fontSize="large" />
    </IconButton>)
}

export default Power;