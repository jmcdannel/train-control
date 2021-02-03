import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export const Signal = props => {

  const { effect, effect: { effectId }, onChange, getMetaData } = props;

  const handleChange = (event, newValue) => {
    onChange({ effectId, state: newValue });
  };

  return (
    <Grid container direction="row">
      <Grid item xs={9}>
        {getMetaData(effect)}
        <p>State: {effect.state}</p>
      </Grid>
      <Grid item xs={3}>
        <ToggleButtonGroup 
          size="small" 
          orientation="vertical" 
          value={'red'} 
          exclusive 
          onChange={handleChange}>
          <ToggleButton value="1">
            <FiberManualRecordIcon style={{color: 'red', opacity: effect.state == 1 ? 1 : .1 }} />
          </ToggleButton>
          <ToggleButton value="2">
            <FiberManualRecordIcon style={{color: 'yellow', opacity: effect.state == 2 ? 1 : .1 }} />
          </ToggleButton>
          <ToggleButton value="0" >
            <FiberManualRecordIcon style={{color: 'green', opacity: effect.state == 0 ? 1 : .1 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>  
  );
}

export default Signal;