import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Power from './Power';
import StatusMonitor from './StatusMonitor';
import { getByLink } from '../Shared/Config/navConfig';

export const Header = props => {

  const { 
    page, 
    jmriApi, 
    jmriReady, 
    onSSLAuth: handleSSLAuth 
  } = props;

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ menu, setMenu ] = useState(null);
  const navItem = getByLink(page);

  const handleClose = () => {
    setMenu(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className="title">
          {navItem ? navItem.label : '[unknown]'}
        </Typography>
        <StatusMonitor jmriReady={jmriReady} />

        <Power jmriApi={jmriApi} jmriReady={jmriReady} />
      </Toolbar>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!menu}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSSLAuth}>View API Host</MenuItem>
      </Menu>
    </AppBar>
  );

}

export default Header;