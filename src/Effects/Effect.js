import React, { useContext, useState } from 'react';
import * as Colors from 'material-ui/colors';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import HighlightIcon from '@material-ui/icons/Highlight';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import TrafficIcon from '@material-ui/icons/Traffic';
import Signal from './Signal';
import { Context } from '../Store/Store';
import api from '../Api';
import { getSectionColor, getLineColor, getEffectColor } from '../config/config';
import { AutoComplete } from 'material-ui';



export const Effect = props => {

  const { effect, effect: { effectId }, view } = props;

  const [ state, dispatch ] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

  const handleSwitchChange = (event) => {
    updateEffect({ effectId, state: event.target.checked ? 1 : 0 })
  };

  const handleButtonClick = (event) => {
    updateEffect({ effectId, state: 1 })
  };

  const updateEffect = async (changedEffect) => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      setIsPristine(false);
      const newEffect = await api.effects.put(changedEffect);
      await dispatch({ type: 'UPDATE_EFFECT', payload: newEffect });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const getMetaData = effect => (
    <div className="effect__meta">
      <p>
        <strong>{effect.actions.length}</strong> Actions 
        | 
        State: <strong>{effect.state}</strong>
      </p>
      {effect.line && (<Chip 
        label={`Line: ${effect.line}`} 
        size="small"
        variant="outlined"
        style={{  
          margin: '0.25rem',
          borderColor: getLineColor(effect.line) 
        }}
      />)}
      {effect.section && (<Chip 
        label={`Section: ${effect.section}`} 
        size="small"
        variant="outlined"
        style={{  
          margin: '0.25rem',
          borderColor: getSectionColor(effect.section)
        }}
      />)}
    </div>
  );

  const isSmallView = (view === 'pill' || view === 'tiny');
  const size = isSmallView ? 'small' : null;

  const getAvatar = () => {
    switch(effect.type) {
      case 'Light':
        return (<HighlightIcon fontSize={size} />);
      case 'Lighting Animation':
        return (<MovieFilterIcon fontSize={size} />);
      case 'Signal':
        return (<TrafficIcon fontSize={size} />);
      case 'Sound Loop':
        return (<MusicNoteIcon fontSize={size} />);
      default:
        return effect.type.substring(0, 1);                                                                                
    }
  }

  const getAction = () => {
    switch(effect.type) {
      case 'Signal':
        return null;
      case 'Sound':
        return (
            <Button 
              onClick={handleButtonClick} 
              color="secondary" 
              size="small"
              variant="outlined" 
              startIcon={<MusicNoteIcon />}>
                Play
            </Button>
          );
      default:
        return (
          <Switch
            checked={effect.state}
            onChange={handleSwitchChange}
            name="effectSwitch"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        )                    
    }
  }

  const renderContent = () => {
    switch(effect.type) {
      case 'Signal':
        return (<Signal effect={effect} getMetaData={getMetaData} onChange={updateEffect} view={view} />);
      default:
        return (
        <Grid container direction="row">
          {!isSmallView && (<Grid item xs={9}>
            {getMetaData(effect)}
          </Grid>)}
          <Grid item xs={isSmallView ? 12 : 3}>
            {getAction()}
          </Grid>
        </Grid>);
    }
  }

  return (
    <Card className="effect">
      <CardHeader
        avatar={
          <Avatar style={{
            backgroundColor: getEffectColor(effect.type),
            width: isSmallView ? '20px' : 'auto',
            height: isSmallView ? '20px' : 'auto'
          }}>
            {getAvatar()}
          </Avatar>}
        title={effect.name}
      />
      <CardContent>
          {renderContent()}
      </CardContent>
      
    </Card>
  )

}

export default Effect;