import React from 'react';
import Slider from '@material-ui/core/Slider';

export const ThrottleSlider = props => {


  const scale = 128;
  const step = 16;
  let marks = [];

  for(let idx = -scale; idx < scale; idx += step) {
    marks.push({
      value: idx,
      label: idx
    });
  }
  return (
    <Slider
        orientation="vertical"
        defaultValue={0}
        min={-scale}
        max={scale}
        step={step}
        marks={marks}
        aria-labelledby="vertical-slider"
        className="throttle__slider"
        
      />
  );

}

export default ThrottleSlider;