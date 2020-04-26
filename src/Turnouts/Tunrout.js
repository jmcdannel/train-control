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

import CallSplit from '@material-ui/icons/CallSplit';
import RestoreIcon from '@material-ui/icons/Restore';
import MapIcon from '@material-ui/icons/Map';
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
import api from '../Api';
import './Turnout.scss';

export const Turnout = props => {

  const { config } = props;
  const { name, id, line, abbr, current, straight, divergent, 'default': defaultOrientation } = config;

  const [turnoutConfig, setTurnoutConfig] = useState(config);
  const [isDivergent, setIsDivergent] = useState(current === divergent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setIsDivergent((current === divergent));
  }, [current, straight, divergent]);

  useEffect(() => {
    setTurnoutConfig(config);
  }, [config]);

  const handleToggle = e => {
    const data = { id, current: isDivergent ? straight : divergent };
    handleConfigChange(data);
  }

  const handleReset = async e => {
    const data = { id, current: defaultOrientation === 'straight' ? straight : divergent };
    await handleConfigChange(data);
  }

  const handleSettings = () => setShowSettings(true);

  const hideSettings = () => setShowSettings(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };

  const handleConfigChange = async data => {
    debugger;
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.put(data);
      handleConfigUpdated(response);
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  }

  const handleConfigUpdated = newConfig => {
    setIsPristine(false);
    setIsLoading(false);
    setTurnoutConfig(newConfig);
    setIsDivergent(newConfig.current === newConfig.divergent);
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
              avatar={<Avatar>{line}</Avatar>}
              label="Line"
              variant="outlined"
              className="chip"
            />
            <Chip
              icon={<CallSplit />}
              label={id}
              variant="outlined"
              className="chip"
            />
            <Chip
              icon={isPristine ? <LinkOffIcon /> :  <LinkIcon />}
              label={`${isLoading ? 'connecting...' : isPristine ? 'unknown' : 'connected'}`}
              variant="outlined"
              className="chip"
            />
          </Box>
          <Box my={1}>
            <Typography component="h5" variant="h5" gutterBottom>
              {name}
            </Typography>
            <Typography component="small" gutterBottom>
              Angle: {current}
            </Typography>
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
      <Settings open={showSettings} config={config} onClose={hideSettings} />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
	)

}

export default Turnout;