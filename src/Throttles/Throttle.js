import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ReportIcon from '@material-ui/icons/Report';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ThrottleSlider from './ThrottleSlider';
import ThrottleSpeed from './ThrottleSpeed';
import Functions from './Functions';

import './Throttle.scss';

export const Throttle = props => {

  const handleClick = e => {
    console.log('Throttle Click', e);
    props.onchange(e);
  }

  const handleScale = (e, x) => {
    console.log('handleScale', e, x);
  }

  return (
    <Card className="throttle" >
      <CardHeader
        avatar={
          <Avatar aria-label="line">
            AM
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="1234"
      />
      <CardContent className="throttle__content">
        <Grid container spacing={2}  className="throttle__content__grid">
          <Grid item 
            xs={12} 
            sm={6}
            justify="center"
            alignItems="center">
              <div className="throttle__controls">
                <div className="throttle__controls__slider">
                    <ThrottleSlider />
                </div>
                <div className="throttle__controls__speed">
                  <ThrottleSpeed/>
                </div>
              </div>
          </Grid>
          <Grid item xs={12} sm={6} className="throttle__functions">
            <Functions />
          </Grid>
        </Grid>
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