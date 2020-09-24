import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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
        subheader="September 14, 2016"
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
          <Grid item xs={12} sm={6} className="throttle__functinos">
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
      </CardActions>
    </Card>
  )
}

export default Throttle;