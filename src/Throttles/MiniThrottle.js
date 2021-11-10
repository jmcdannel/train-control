import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TrainIcon from '@material-ui/icons/Train';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import IconButton from '@material-ui/core/IconButton';
import ThrottleSpeed from './ThrottleSpeed';
import JmriThrottleController from './JmriThrottleController';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Context } from '../Store/Store';
import useDebounce from '../Shared/Hooks/useDebounce';

export const MiniThrottle = props => {

  const [ state, dispatch ] = useContext(Context);
  const maxSpeed = 100;
  const minSpeed = -maxSpeed;
	const STOP = '0.0';

  const { jmriApi, onLocoClick, loco, loco: { 
    address, 
    isAcquired, 
    isPinned,
    speed, 
    forward
  } } = props;


  const initialUiSpeed = speed * 100 * (forward === true ? 1 : -1);

  const [ uiSpeed, setUiSpeed ] = useState(initialUiSpeed);
  const [ dirty, setDirty ] = useState(speed ? speed * 100 : 0);
  const debouncedSpeed = useDebounce(uiSpeed, 100);

  useEffect(() => {
    if (!isPinned) {
      dispatch({ type: 'UPDATE_LOCO', payload: { address, isPinned: true } });
    }
  }, [uiSpeed, isPinned, address, dispatch]);

  const handleStopClick = () => {
    setUiSpeed(parseInt(STOP));
  }

  const handleUpClick = () => {
    setUiSpeed(uiSpeed + 1);
  }

  const handleDownClick = () => {
    setUiSpeed(uiSpeed - 1);
  }

  const handleLocoClick = () => {
    if (onLocoClick) {
      onLocoClick(loco);
    }
  }

  const computedClassName = () => {
    return ['mini-throttle', isAcquired ? 'mini-throttle__acquired' : 'mini-throttle__notacquired'].join(' ');
  }

  return (
    <Paper elevation={3} className={computedClassName()}>
        <Chip
            label={`${loco.address}`}
            icon={<TrainIcon />}
            className="chip"
            variant={isAcquired ? 'default' : 'outlined'}
            clickable
            onClick={handleLocoClick}
          />
      {isAcquired ? (
        <>
          <JmriThrottleController speed={debouncedSpeed} address={address} jmriApi={jmriApi} forward={forward} />
          <ThrottleSpeed speed={debouncedSpeed} idleByDefault={loco.idleByDefault} />
          <IconButton variant="outlined" size="medium" disabled={speed === minSpeed} onClick={handleDownClick}><RemoveIcon /></IconButton>
          <IconButton size="medium"  disabled={!isAcquired} variant="contained" color="primary" onClick={handleStopClick} ><PanToolIcon /></IconButton>
          <IconButton variant="outlined" size="medium" disabled={speed === maxSpeed} onClick={handleUpClick}><AddIcon /></IconButton>
        </>
      ) : ( 
        <IconButton variant="outlined" size="medium" variant="contained" color="primary" onClick={handleLocoClick}><OpenInBrowserIcon /></IconButton>
      )}
      </Paper>
  )

}

export default MiniThrottle;
