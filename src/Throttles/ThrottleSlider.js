import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export const ThrottleSlider = props => {

  const { speed, idleByDefault, onChange } = props;
  const [ idle, setIdle] = useState(idleByDefault);

  const scale = 100;
  const step = 10;
  const marks = Array.apply(null, Array(scale * 2 / step + 1)).map((x, i) => {
    const mark = (scale * -1) + i * step;
    return {
      label: mark,
      value: mark
    };
  });

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleIdleChange = event => {
    setIdle(event.target.checked);
    onChange(0);
  }

  const handleChangeCommitted = (event, newValue) => {
    if (idle) {
      onChange(0);
    }
  };

  return (
    <Grid container spacing={2} direction="column-reverse" className="throttle__slider__container">
      <Grid item className="throttle__slider__item">
        <div className="throttle__slider__wrapper">
          <Slider
              orientation="vertical"
              defaultValue={0}
              min={-scale}
              max={scale}
              marks={marks}
              value={speed}
              track={false}
              aria-labelledby="vertical-slider"
              onChange={handleChange}
              onChangeCommitted={handleChangeCommitted}
              className={`throttle__slider 
              ${speed < 0 
                ? 'throttle__speed--reverse' 
                : 'throttle__speed--forward'}`}
              
            />
          </div>
      </Grid>
      {/* <Grid item>
        <FormControlLabel
          control={<Switch checked={idle} onChange={handleIdleChange} name="isIdle" />}
          label="Idle"
        />
      </Grid> */}
    </Grid>
  );

}

export default ThrottleSlider;