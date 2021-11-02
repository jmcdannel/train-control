import React, { useState, useEffect, useContext } from 'react';
import * as Colors from 'material-ui/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TrainIcon from '@material-ui/icons/Train';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PanToolIcon from '@material-ui/icons/PanTool';
import ReportIcon from '@material-ui/icons/Report';
import ThrottleSlider from './ThrottleSlider';
import ThrottleSpeed from './ThrottleSpeed';
import JmriThrottleController from './JmriThrottleController';
import Functions from './Functions';
import useDebounce from '../Shared/Hooks/useDebounce';
import './Throttle.scss';


export const Throttle = props => {

  const maxSpeed = 100;
  const minSpeed = -maxSpeed;
  // const EMERGENCY_STOP = '-1.0';
	const STOP = '0.0';
  // const FULL_SPEED = '1.0';

  const { jmriApi, loco, onLocoClick, loco: { 
    address, 
    isAcquired, 
    speed, 
    idleByDefault,
    forward
  } } = props;
  
  const initialUiSpeed = speed * 100 * (forward === true ? 1 : -1);

  // const [ initialized, setInitialized ] = useState(false);
  const [ uiSpeed, setUiSpeed ] = useState(initialUiSpeed);
  const debouncedSpeed = useDebounce(uiSpeed, 100);

  // useEffect(() => {
  //   if (!initialized) { // TODO: move to store
  //     const jmriState = jmriApi.getState();
  //     if (jmriState.ready) {
  //       jmriReady();
  //     } else {
  //       jmriApi.on('ready', 'Throttle', jmriReady);
  //     }
  //   }
  // }, [ initialized, jmriApi ]);

  // const jmriReady = () => {
  //   setInitialized(true);
  // }

  const handleSliderSpeed = value => {
    setUiSpeed(value);
  }

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

  const roadClassName = () => {
    return loco.road.toLowerCase().replace(/ /g, '-');
  }

  const formattedAddress = () => loco.address && loco.address.length > 2
    ? loco.address.substring(0, 2)
    : loco.address;

  return (
    <Card className={`throttle throttle--${loco.name.replace(' ', '')}  throttle--${loco.road.replace(' ', '')}`} >

      <CardHeader
        title={loco.name}
        avatar={
          <Chip
              label={`${loco.address}`}
              icon={<TrainIcon />}
              className={roadClassName()}
              clickable
              onClick={handleLocoClick}
            />
        }
        // action={
        //   <IconButton aria-label="settings" onClick={handleMenuClick}>
        //     <MoreVertIcon />
        //   </IconButton>
        // }
      />
      <CardContent className="throttle__content">
        {(true || loco.isAcquired) && 
          <Grid container spacing={2}  className="throttle__content__grid">
            <Grid item 
              xs={5}>
                  <div className="throttle__slider">
                    {isAcquired && (
                      <JmriThrottleController speed={debouncedSpeed} address={address} jmriApi={jmriApi} forward={forward} />
                    )}
                    <ThrottleSlider className="throttle__slider__control" speed={uiSpeed} idleByDefault={idleByDefault} onChange={handleSliderSpeed} />
                  </div>
            </Grid>
            <Grid item xs={7} className="throttle__controls">
              <Functions />
              <div className="throttle__space"></div>
              <Paper elevation={3} className="width100" >
                {/* <pre>speed={loco.speed}</pre>
                <pre>uiSpeed={uiSpeed}</pre> */}
                <ThrottleSpeed  speed={uiSpeed} idleByDefault={loco.idleByDefault} />
                <Grid container spacing={2} className="throttle__controls__status">
                  <Grid item className="flex">
                    <Button className="width100" variant="contained" color="primary" startIcon={<PanToolIcon />} size="large" onClick={handleStopClick}>Stop</Button>
                  </Grid>
                  <Grid item className="grow">
                    <ButtonGroup
                      orientation="vertical"
                      color="primary"
                      variant="outlined"
                      className="throttle__controls__group width100"
                      aria-label="vertical outlined primary button group"
                    >
                      <Tooltip title="Speed Increase">
                        <Button size="large" disabled={speed === maxSpeed} onClick={handleUpClick} >+</Button>
                      </Tooltip>
                      {/* <Tooltip title="Idle">
                        <Button onClick={handleIdleClick} >Idle</Button>
                      </Tooltip> */}
                      <Tooltip title="Speed Decrease">
                        <Button size="large" disabled={speed === minSpeed} onClick={handleDownClick}>-</Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        }
      </CardContent>
      
    </Card>
  )
}

export default Throttle;
