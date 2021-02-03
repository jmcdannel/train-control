import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Signal from './Signal';
import api from '../Api';

export const Effect = props => {

  const { effect, effect: { effectId } } = props;


  const handleChange = (event) => {
    api.effects.put({ effectId, state: event.target.checked ? 1 : 0 });
  };

  const renderEffect = () => {
    switch(effect.type) {
      case 'Signal':
        return <Signal effect={effect} />;
      default:
        return (
          <>
            <h3>{effect.name}</h3>
            <Switch
              checked={effect.state}
              onChange={handleChange}
              name="effectSwitch"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            {}
          </>
        );
    }
  }

  return (<div className="effect">{renderEffect()}</div>);

}

export default Effect;