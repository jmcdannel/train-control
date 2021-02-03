import React, { useContext, useState } from 'react';
import * as Colors from 'material-ui/colors';
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



export const Effect = props => {

  const { effect, effect: { effectId } } = props;

  const [ state, dispatch ] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

  const handleChange = (event) => {
    updateEffect({ effectId, state: event.target.checked ? 1 : 0 })
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
    <>
    <Chip 
      label={`Line: ${effect.line}`} 
      size="small"
      variant="outlined"
      style={{  
        margin: '0.25rem',
        borderColor: getLineColor(effect.line) 
      }}
    />
    <Chip 
      label={`Section: ${effect.section}`} 
      size="small"
      variant="outlined"
      style={{  
        margin: '0.25rem',
        borderColor: getSectionColor(effect.section)
      }}
    />
    </>
  );

  const getAvatar = type => {
    switch(type) {
      case 'Light':
        return (<HighlightIcon />);
      case 'Lighting Animation':
        return (<MovieFilterIcon />);
      case 'Signal':
        return (<TrafficIcon />);
      case 'Sound Loop':
        return (<MusicNoteIcon />);
      default:
        return type.substring(0, 1);                                                                                
    }
  }

  const renderContent = () => {
    switch(effect.type) {
      case 'Signal':
        return (<Signal effect={effect} getMetaData={getMetaData} onChange={updateEffect} />);
      default:
        return getMetaData(effect);
    }
  }

  return (
    <Card className="effect">
      <CardHeader
        avatar={
          <Avatar style={{
            backgroundColor: getEffectColor(effect.type)
          }}>
            {getAvatar(effect.type)}
          </Avatar>
        }
        action={
          <Switch
            checked={effect.state}
            onChange={handleChange}
            name="effectSwitch"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        title={effect.name}
        subheader={(<>
            <strong>{effect.actions.length}</strong> Actions 
            | 
            State: <strong>${effect.state}</strong>
          </>)}
      />
      <CardContent>
          {renderContent()}
      </CardContent>
      
    </Card>
  )

}

export default Effect;