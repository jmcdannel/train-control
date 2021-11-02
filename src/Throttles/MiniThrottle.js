import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TrainIcon from '@material-ui/icons/Train';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
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
      {isAcquired && (
        <JmriThrottleController speed={debouncedSpeed} address={address} jmriApi={jmriApi} forward={forward} />
      )}
      <ThrottleSpeed speed={debouncedSpeed} idleByDefault={loco.idleByDefault} isDisabled={!isAcquired} />
      <Button className="mini-throttle__stop" disabled={!isAcquired} variant="contained" color="primary" startIcon={<PanToolIcon />} size="large" onClick={handleStopClick}>Stop</Button>
       
      <ButtonGroup
        orientation="horizontal"
        color="primary"
        variant="outlined"
        className="throttle__controls__group"
        aria-label="vertical outlined primary button group"
      >
        <Button size="large" disabled={speed === maxSpeed || !isAcquired} onClick={handleUpClick} >+</Button>
        <Button size="large" disabled={speed === minSpeed || !isAcquired} onClick={handleDownClick}>-</Button>
      </ButtonGroup>

    </Paper>
  )

}

export default MiniThrottle;
