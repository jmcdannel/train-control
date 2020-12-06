import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import api from '../Api';

export const Signal = props => {

  const { signal } = props;

  const handleGreenClick = event => {
    console.log('handleGreenClick', event);
    api.signals.put({ ...signal, state: 1 });
  }

  const handleRedClick = event => {
    console.log('handleRedClick', event);
    api.signals.put({ ...signal, state: 0 });
  }

  return (
    <div>
      <h3>{signal.abbr}</h3>
      <Button variant="outlined" color="primary" onClick={handleGreenClick}>
        Green
      </Button>
      <Button variant="outlined" color="primary" onClick={handleRedClick}>
        Red
      </Button>
    </div>
  );

}

export default Signal;