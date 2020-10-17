import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
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
import PanToolIcon from '@material-ui/icons/PanTool';
import ReportIcon from '@material-ui/icons/Report';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ThrottleSlider from './ThrottleSlider';
import ThrottleSpeed from './ThrottleSpeed';
import JmriThrottleController from './JmriThrottleController';
import Functions from './Functions';
import useDebounce from '../Shared/Hooks/useDebounce';
import usePrevious from '../Shared/Hooks/usePrevious';

import './Throttle.scss';

export const Throttle = props => {

  const maxSpeed = 100;
  const minSpeed = -maxSpeed;
  const EMERGENCY_STOP = '-1.0';
	const STOP = '0.0';
  const FULL_SPEED = '1.0';

  const { throttleApi, loco: { address }, loco } = props;

  const [ locoAcquired, setLocoAcquired ] = useState(false);
  const [ speed, setSpeed ] = useState(0);

  useEffect(() => {
    const requestLoco = async address => {
      await throttleApi.requestLoco(address);
      setLocoAcquired(true);
    }
    if (!locoAcquired) {
      requestLoco(address);
    }
  }, [locoAcquired, throttleApi, address]);
  
  const handleSliderSpeed = value => {
    console.log('handleSliderSpeed', value);
    setSpeed(value);
  }

  const handleStopClick = () => {
    console.log('handleStopClick', STOP);
    setSpeed(parseInt(STOP));
  }

  const handleUpClick = () => {
    setSpeed(speed + 1);
  }

  const handleDownClick = () => {
    setSpeed(speed - 1);
  }

  const roadClassName = () => {
    return loco.road.toLowerCase().replace(/ /g, '-');
  }


  return (
    <Card className="throttle" >
      <CardHeader
        avatar={
          <Avatar aria-label="line" className={roadClassName()}>
            {loco.address}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={loco.name}
      />
      <CardContent className="throttle__content">
        {locoAcquired && 
          <Grid container spacing={2}  className="throttle__content__grid">
            <Grid item 
              xs={5}
              justify="center"
              alignItems="center">
                  <div className="throttle__slider">
                    <JmriThrottleController speed={speed} address={address} throttleApi={throttleApi} />
                    <ThrottleSlider className="throttle__slider__control" speed={speed} onChange={handleSliderSpeed} />
                  </div>
            </Grid>
            <Grid item xs={7} className="throttle__controls">
              <Functions />
              <Paper elevation={3}  className="throttle__controls__status" >
                <Grid container spacing={2}>
                  <Grid item className="flex">
                    <Button variant="contained" color="primary" startIcon={<PanToolIcon />} size="large" onClick={handleStopClick}>Stop</Button>
                  </Grid>
                  <Grid item className="flex grow">
                    <Grid container spacing={2}>
                      <Grid item className="flex grow">
                        <ThrottleSpeed  speed={speed} />
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          orientation="vertical"
                          color="primary"
                          variant="outlined"
                          className="throttle__controls__group"
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
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        }
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>


        <IconButton aria-label="share" color="secondary" className="throttle__actions__primary">
          <ReportIcon fontSize="large" />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default Throttle;