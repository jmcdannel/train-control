import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HttpsIcon from '@material-ui/icons/Https';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Power from './Power';
import StatusMonitor from './StatusMonitor';

export const Header = props => {

  const { 
    page, 
    handleMenuClick, 
    handleApiClick, 
    jmriApi, 
    jmriReady, 
    layout,
    onSSLAuth: handleSSLAuth 
  } = props;

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ menu, setMenu ] = useState(null);

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
    setMenu(page);
  }

  const handleClose = () => {
    setMenu(null);
  };

  const handleTurnoutsCompactClick = () => {
    handleMenuClick({ view: 'compact' });
    handleClose();
  }

  const handleTurnoutsComfyClick = () => {
    handleMenuClick({ view: 'comfy' });
    handleClose();
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className="title">
          {page} - {jmriReady.toString()}
        </Typography>
        <StatusMonitor jmriReady={jmriReady} layout={layout} />
        <Power jmriApi={jmriApi} jmriReady={jmriReady} />
        <IconButton
            onClick={handleSSLAuth}
            color="inherit"
            variant="outlined"
          >
            <HttpsIcon />
          </IconButton>
          <IconButton 
            variant="outlined"
            aria-label="display more actions" 
            edge="end" 
            color="inherit"
            onClick={handleClick}>
            <MoreIcon />
          </IconButton>
      </Toolbar>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!menu}
        onClose={handleClose}
      >
        <MenuItem onClick={handleApiClick}>API Host</MenuItem>
        <MenuItem onClick={handleTurnoutsCompactClick}>Compact</MenuItem>
        <MenuItem onClick={handleTurnoutsComfyClick}>Comfy</MenuItem>
      </Menu>
    </AppBar>
  );

}

export default Header;