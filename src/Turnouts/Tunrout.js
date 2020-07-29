import React, { useState, useEffect } from 'react';
// import SwitchImg from './switch.svg';
import { ReactComponent as Logo } from './switch.svg';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import CallSplit from '@material-ui/icons/CallSplit';
import RestoreIcon from '@material-ui/icons/Restore';
import MapIcon from '@material-ui/icons/Map';
import PowerIcon from '@material-ui/icons/Power';
import TuneIcon from '@material-ui/icons/Tune';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Settings from './Settings';
import { api, linesConfig } from '../Api';
import './Turnout.scss';

export const Turnout = props => {

  const { config, linked: linkedTurnout, onChange  } = props;

  const [isDivergent, setIsDivergent] = useState(config.current === config.divergent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLinked, setIsLinked] = useState(true);
  const { current, relay, crossover, reverse, name, id, line, label, abbr, straight, divergent, 'default': defaultOrientation } = config;

  useEffect(() => {
    setIsDivergent((current === divergent));
  }, [current, straight, divergent]);

  const handleToggle = async e => {
    if (isLoading) { 
      return;
    }
    try {
      const data = [{ id, current: isDivergent ? straight : divergent }];
      setIsLoading(true);
      setIsPristine(false);

      if (linkedTurnout && isLinked) {
        data.push({
          id: linkedTurnout.id,
          current: isDivergent 
            ? linkedTurnout.straight 
            : linkedTurnout.divergent
        })
      }
      await onChange(data);

    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
    
  }


  const handleReset = async e => {
    const data = { id, current: defaultOrientation === 'straight' ? straight : divergent };
    await onChange([data]);
  }

  const handleSettings = () => setShowSettings(true);

  const hideSettings = () => setShowSettings(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };

  const handleLinkedChange = event => {
    setIsLinked(event.target.checked);
  }

	return (
    <Card className="turnout">
      <CardActionArea className={`media ${isLoading ? 'loading' : ''}`} onClick={handleToggle}>
        <CardMedia
          component="div"
          height="100%"
          title="Turnout State"
          className="media-container"        
        >
          <div className="svg-wrapper">
            <Logo width="90" className={`turnout-image ${isDivergent ? 'divergent' : 'straight'}`} />
          </div>
          {isLoading && (<CircularProgress color="primary" className="spinner" />)}
        </CardMedia>
      </CardActionArea>
      <CardContent className="information">
        <Box>
            <Chip
              label={`${label}`}
              icon={<CallSplit />}
              variant="outlined"
              className="chip"
              size="small"
              style={{ backgroundColor: linesConfig.find(l => l.name === line).color }}
            />
            {isLoading || isPristine 
              ? <LinkOffIcon style={{color: 'gray'}} /> 
              :  <LinkIcon style={{color: 'green'}} />}
            {relay && (
              <PowerIcon style={{ color: 'green'}}
            />
            )}
          </Box>
          <Box my={1}>
            <Typography component="h6" variant="h6" gutterBottom>
              {name} <strong style={{whiteSpace:"nowrap"}}>({abbr})</strong>
            </Typography>
            <Typography component="small" gutterBottom>
              Angle: {current}
            </Typography>
            {crossover && (<Box><FormControlLabel
              control={<Switch checked={isLinked} onChange={handleLinkedChange} name="islinked" />}
              label={`Link crossover: ${linkedTurnout.label}`}
            /></Box>)}
            
            {reverse && (<Box><FormControlLabel
              control={<Switch checked={isLinked} onChange={handleLinkedChange} name="islinked" />}
              label={`Link reverse loop switch: ${linkedTurnout.label}`}
            /></Box>)}
          </Box>
      </CardContent>
      <CardActions className="actions">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleToggle}
          startIcon={<CallSplit />}>
            Toggle
        </Button>
        <span>
          <IconButton variant="outlined" onClick={handleReset} color="primary" disabled={isLoading}>
            <RestoreIcon />
          </IconButton>
          {/* <IconButton variant="outlined" color="default">
            <MapIcon />
          </IconButton> */}
          <IconButton variant="outlined" color="default" onClick={handleSettings}>
            <TuneIcon />
          </IconButton>
        </span>
      </CardActions>
      <Settings 
        open={showSettings} 
        config={config} 
        onClose={hideSettings}
        onChange={onChange} 
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
	)

}

export default Turnout;