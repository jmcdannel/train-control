import React from 'react';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import HighlightIcon from '@material-ui/icons/Highlight';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

export const Functions = props => {

  const functionButtons = new Array(28).fill({}).map((item, idx) => {
    console.log(idx, item);
    switch(idx) {
      case 0:
        return {
          label: 'Horn',
          icon: (<ShareIcon />)
        }
      case 1:
        return {
          label: 'Light',
          icon: (<HighlightIcon />)
        }
      case 2:
        return {
          label: 'Whistle',
          icon: (<ShareIcon />)
        }
      case 3:
        return {
          label: 'Bell',
          icon: (<NotificationsIcon />)
        }
      default: 
        return {
          label: `Func ${idx+1}`,
          icon: (<DeviceHubIcon />)
        }
    }
    
  });

  console.log('functionButtons', functionButtons);

  return (
    <div className="throttle__functions">
      <div className="throttle__functions__viewport">

        {functionButtons.map(btn => (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            className="throttle__functions__btn"
            startIcon={btn.icon}
          >
            {btn.label}
          </Button>
        ))}

      </div>
    </div>
  );

}

export default Functions;