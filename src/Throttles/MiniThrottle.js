import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
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

  const { jmriApi, loco, loco: { 
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

  return (
    <Paper elevation={3} className="mini-throttle">
      <Avatar aria-label="line">
        {loco.address}
      </Avatar>
      {isAcquired && (
        <JmriThrottleController speed={debouncedSpeed} address={address} jmriApi={jmriApi} forward={forward} />
      )}
      <ThrottleSpeed speed={debouncedSpeed} idleByDefault={loco.idleByDefault} />
      <Button className="mini-throttle__stop" variant="contained" color="primary" startIcon={<PanToolIcon />} size="large" onClick={handleStopClick}>Stop</Button>
       
      <ButtonGroup
        orientation="horizontal"
        color="primary"
        variant="outlined"
        className="throttle__controls__group"
        aria-label="vertical outlined primary button group"
      >
        <Tooltip title="Speed Increase">
          <Button size="large" disabled={speed === maxSpeed} onClick={handleUpClick} >+</Button>
        </Tooltip>
        <Tooltip title="Speed Decrease">
          <Button size="large" disabled={speed === minSpeed} onClick={handleDownClick}>-</Button>
        </Tooltip>
      </ButtonGroup>

    </Paper>
  )

}

export default MiniThrottle;
