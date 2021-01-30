import React, { useState, useEffect, useContext } from 'react';
import * as Colors from 'material-ui/colors';
// import SwitchImg from './switch.svg';
import { ReactComponent as Logo } from './switch.svg';
import { ReactComponent as TurnoutStriaghtImage } from '../Shared/Images/turnout-straight.svg';
import { ReactComponent as TurnoutDivergentImage } from '../Shared/Images/turnout-divergent.svg';
import { ReactComponent as TurnoutDImage } from '../Shared/Images/turnout-export.svg';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Switch from '@material-ui/core/Switch';

import CallSplit from '@material-ui/icons/CallSplit';
import RestoreIcon from '@material-ui/icons/Restore';
import PowerIcon from '@material-ui/icons/Power';
import TuneIcon from '@material-ui/icons/Tune';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import PortableWifiOffIcon from '@material-ui/icons/PortableWifiOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Settings from './Settings';
import { Context } from '../Store/Store';
import api from '../Api';
import './Turnout.scss';
// import { linesConfig } from '../Api';


export const linesConfig = [
  { lineId: 'Mainline Red', label: 'Mainline SB', color: Colors.red[500] },
  { lineId: 'Mainline Green', label: 'Mainline NB', color: Colors.green[500] },
  { lineId: 'Tamarack Station', label: 'Tamarack Station North', color: Colors.cyan[500] }
];
// import { ReactComponent as TurnoutMaskLeft4Diverge } from './images/left-4-diverge.svg';


export const Turnout = props => {

  const { config } = props;
  
  const [ state, dispatch ] = useContext(Context);

  const [isDivergent, setIsDivergent] = useState(config.current === config.divergent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { current, relay, crossover, reverse, name, turnoutId, line, label, abbr, straight, divergent, 'default': defaultOrientation } = config;

  useEffect(() => {
    setIsDivergent((current === divergent));
  }, [current, straight, divergent]);

  const handleToggle = async e => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      setIsPristine(false);
      const turnout = await api.turnouts.put({ turnoutId, current: isDivergent ? straight : divergent });
      await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
    
  }

  const handleReset = async e => {
    const turnout = await api.turnouts.put({ turnoutId, current: defaultOrientation === 'straight' ? straight : divergent });
    await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
  }

  const handleSettings = () => setShowSettings(true);

  const hideSettings = () => setShowSettings(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };

	return (
    <Card className={`turnout turnout--compact`}>
      <CardHeader className="turnout__header">
        <Chip
            label={`${abbr}`}
            icon={<CallSplit />}
            variant="outlined"
            className="chip"
            size="small"
            style={{ backgroundColor: linesConfig.find(l => l.lineId === line).color }}
          />
          <Box className="turnout__header__status">
            {isLoading || isPristine 
              ? <PortableWifiOffIcon style={{color: 'gray'}} /> 
              :  <WifiTetheringIcon style={{color: 'green'}} />}
            {relay && (
              <PowerIcon style={{ color: 'green'}}
              />
            )}
        </Box>
      </CardHeader>
      <CardContent className="turnout__id">


        <CardActionArea className={`turnout__state ${isLoading ? 'loading' : ''}`} onClick={handleToggle}>
          <CardMedia
            component="div"
            height="100%"
            title="Turnout State"
            className="media-container"        
          >
            <div className="svg-wrapper">
              {/* <Logo width="90" className={`turnout-image ${isDivergent ? 'divergent' : 'straight'}`} /> */}
              {isDivergent ? <TurnoutDivergentImage width="90" /> : <TurnoutStriaghtImage width="90" />}
            </div>
            {isLoading && (<CircularProgress color="primary" className="spinner" />)}
          </CardMedia>
        </CardActionArea>
          
        <Box my={1} className="turnout__desc compact-hidden">
          <Typography component="h6" variant="h6" gutterBottom>
            {name} <strong style={{whiteSpace:"nowrap"}}>({abbr})</strong>
          </Typography>
          <Typography component="small" gutterBottom>
            Angle: {current}
          </Typography>
          {/* {(crossover || reverse) && (
          <Box className="turnout__link">
              {crossover && (
                <Chip
                  label={`Crossover`}
                  icon={<ShuffleIcon />}
                  color={`${isLinked ? 'primary' : 'default'}`}
                  size="small"
                />
              )}
              {reverse && (
                <Chip
                  label={`Reverse: ${linkedTurnout.label}`}
                  icon={<SettingsBackupRestoreIcon />}
                  color={`${isLinked ? 'primary' : 'default'}`}
                  size="small"
                />
              )}
              <Switch checked={isLinked} onChange={handleLinkedChange} name="islinked" />
              {isLinked 
                    ? <LinkIcon style={{color: 'green'}} />
                    : <LinkOffIcon style={{color: 'gray'}} />
                  }
          </Box>)} */}
          
        </Box>

      </CardContent>
      <CardActions className="tournout__actions">
        <Button 
          className="compact-hidden"
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
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
	)

}

export default Turnout;