import React from 'react';
import Slider from '@material-ui/core/Slider';

export const ThrottleSlider = props => {

  return (
    <Slider
        orientation="vertical"
        defaultValue={0}
        min={-128}
        max={128}
        step={8}
        marks={true}
        aria-labelledby="vertical-slider"
        className="throttle__slider"
        
      />
  );

}

export default ThrottleSlider;