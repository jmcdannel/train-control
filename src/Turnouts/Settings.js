import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CallSplit from '@material-ui/icons/CallSplit';
import { green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import RestoreIcon from '@material-ui/icons/Restore';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Info from '@material-ui/icons/Info';
import Lock from '@material-ui/icons/Lock';
import Bookmark from '@material-ui/icons/Bookmark';
import LockOpen from '@material-ui/icons/LockOpen';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const getInverse = degrees => {
  return degrees < 90
    ? 90 + (90 - degrees)
    : 90 - (degrees - 90);
}

export const Settings = props => {
  const { open, config, onClose, onChange } = props;
  const { turnoutId } = config;
  const [name, setName] = useState(config.name);
  const [line, setLine] = useState(config.line);
  const [straight, setStraight] = useState(config.straight);
  const [divergent, setDivergent] = useState(config.divergent);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isLinked, setIsLinked] = useState(config.straight === getInverse(config.divergent));
  const [isPristine, setIsPristine] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleClose = () => {
    console.log(props);
    onClose();
  };

  const handleLock = () => setIsLocked(true);

  const handleUnlock = () => setIsLocked(false);

  const handleLink = () => {
    setIsLinked(true);
    setDivergent(straight);
  }

  const handleUnlink = () => setIsLinked(false);

  const handleServo = degrees => {
    if (isLoading) { 
      return;
    }
    setIsLoading(true);
    setHasError(false);
    sendDegrees(degrees).then(resp => {
      console.log('complete', resp);
      setIsPristine(false);
    }).catch(err => {
      console.log(err);
      setHasError(true);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      await onChange([{
        turnoutId,
        name,
        line,
        straight,
        divergent
      }]);
      onClose();
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetServo = () => {
    setStraight(config.straight);
    setDivergent(config.divergent);
  }

  const handleStraightChange = e => {
    const val = parseInt(e.target.value);
    if (isValidDegrees(val)) {
      setStraight(val);
      if (isLinked) {
        setDivergent(getInverse(val));
      }
    }
  }

  const isValidDegrees = value => {
    return true; // disable
    // const intValue = parseInt(value);
    // return (value === '' || 
    //   (/^\d+$/.test(value) && intValue >= 0 && intValue <= 360));
  }

  const handleDivergentChange = e => {
    const val = parseInt(e.target.value);
    if (isValidDegrees(val)) {
      setDivergent(val);
      if (isLinked) {
        setStraight(getInverse(val));
      }
    }
  }
  const sendDegrees = async degrees => {
    return await onChange([{ turnoutId, current: parseInt(degrees) }]);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Turnout Settings</DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={1} mb={3}>
          <DialogContentText>
            Changes are not saved until you click save.
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                id="number"
                label="Switch Num"
                size="small"
                disabled
                value={turnoutId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CallSplit />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                id="line"
                label="Line"
                size="small"
                value={line}
                onChange={e => setLine(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Info />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                id="name"
                label="Switch Name"
                value={name}
                onChange={e => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bookmark />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogTitle id="form-servo-title">
        {!isLocked && (
          <IconButton aria-label="lock" onClick={handleLock}>
            <LockOpen />
          </IconButton>
        )}
        {isLocked && (
          <IconButton aria-label="lock" onClick={handleUnlock}>
            <Lock />
          </IconButton>
        )}
        Configure Servo
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <TextField
              margin="dense"
              id="straight"
              label="Straight"
              width="100px"
              disabled={isLocked || isLoading}
              value={straight}
              onChange={handleStraightChange}
            />
            {isLinked && (
              <IconButton aria-label="unlink" onClick={handleUnlink} disabled={isLocked || isLoading}>
                <LinkIcon />
              </IconButton>
            )}
            {!isLinked && (
              <IconButton aria-label="link" onClick={handleLink} disabled={isLocked || isLoading}>
                <LinkOffIcon />
              </IconButton>
            )}
            <TextField
              margin="dense"
              id="divergent"
              label="Divergent"
              width="100px"
              disabled={isLocked || isLoading}
              value={divergent}
              onChange={handleDivergentChange}
            />
            <Box my={1}>
              <ButtonGroup variant="outlined" color="primary">
                <Button onClick={handleResetServo} disabled={isLocked || isLoading} startIcon={<RestoreIcon />}>
                  Reset
                </Button>
                <Button onClick={() => handleServo(straight)} disabled={isLoading}>
                  Straight
                </Button>
                <Button onClick={() => handleServo(divergent)} disabled={isLoading}>
                  Divergent
                </Button>
                <Button onClick={() => handleServo((straight + divergent) / 2)} disabled={isLoading}>
                  Center&deg;
                </Button>
              </ButtonGroup>
              
            </Box>
            </Grid>
            <Grid item xs={3}>
              {isLoading && (<CircularProgress color="primary" className="spinner" />)}
              {!isLoading && !isPristine && (<DoneIcon color="action" style={{ color: green[500], fontSize: 80 }} />)}
              {hasError && !isLoading && (<ErrorIcon color="error" style={{ fontSize: 80 }} />)}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default Settings;
