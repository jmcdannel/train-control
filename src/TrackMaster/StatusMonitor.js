import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import CallSplit from '@material-ui/icons/CallSplit';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import Tooltip from '@material-ui/core/Tooltip';
import { getConfig } from '../config/config';

export const StatusMonitor = ({ jmriReady }) => {

  const appConfig = getConfig();

  // const [ powerStatus, setPowerStatus ] = useState(powerStates.unknown);
  // const [ initialized, setInitialized ] = useState(false);

  // useEffect(() => {
  //   console.log('useEffect', initialized, jmriReady, jmriApi);
  //   if (jmriReady && !initialized) {
  //     console.log('Power.power', jmriReady);
  //     jmriApi.on('power', handlePowerStateChange);
  //     jmriApi.power();
  //     setInitialized(true);
  //   }
  // }, [ initialized, jmriReady, jmriApi ]);

  // const handlePowerStateChange = state => {
  //   setPowerStatus(state);
  // }

  // const handlePowerClick = () => {
  //   if (powerStatus === powerStates.unknown || powerStatus === powerStates.off) {
  //     jmriApi.power(powerStates.on);
  //   } else if (powerStatus === powerStates.on) {
  //     jmriApi.power(powerStates.off);
  //   }
  // }

  // const getCurrentStateKey = () => {
  //   const currState = Object.keys(powerStates)
  //     .filter(key => powerStates[key] === powerStatus);
  //   return currState.length ? currState[0] : 'unknown';
  // }

  // const getClassName = () => jmriApi.getState().ready && initialized
  //     ? `power-${getCurrentStateKey()}`
  //     : 'power-pending';

  const handleClick = () => { 
    console.log('Not Implemented');

    // TODO: allow user to modify api or jmri settings
  };
  const hasJmri = !!appConfig.jmri;
  const hasApi = !!appConfig.apie;

  const jmriClassName = `status-monitor--${
    hasJmri && jmriReady
      ? 'connected'
      : 'unknown'
    }`;

  const apiClassName = `status-monitor--${
    hasApi
      ? 'connected'
      : 'unknown'
    }`;

  // TODO: handle jmlri disconnected
  // TODO: handle api error

  return (
    <div className="status-monitor">
      {hasJmri && (<Tooltip title="JMRI Connection Status">
        <Chip
          variant="outlined"
          size="small"
          icon={<UnfoldMoreIcon className={jmriClassName} />}
          label="JMRI"
          color="default"
          onClick={handleClick}
        />
      </Tooltip>)}
      {hasApi && (<Tooltip title="REST API Status">
        <Chip
          variant="outlined"
          size="small"
          icon={<CallSplit className={apiClassName} />}
          label="API"
          color="default"
          onClick={handleClick}
        />
      </Tooltip>)}
    </div>
  );
}

export default StatusMonitor;