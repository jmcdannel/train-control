import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HttpsIcon from '@material-ui/icons/Https';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export const Header = props => {

  const { page, handleMenuClick, onSSLAuth: handleSSLAuth } = props;

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ menu, setMenu ] = useState(null);

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
    setMenu(page);
  }

  const handleClose = () => {
    setMenu(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className="title">
          {page}
        </Typography>
        <IconButton
            onClick={handleSSLAuth}
            color="inherit"
          >
            <HttpsIcon />
          </IconButton>
          <IconButton 
            aria-label="display more actions" 
            edge="end" 
            color="inherit"
            onClick={handleClick}>
            <MoreIcon />
          </IconButton>
      </Toolbar>
      <Menu
        id="/turnouts"
        anchorEl={anchorEl}
        keepMounted
        open={menu === '/turnouts'}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMenuClick}>Compact</MenuItem>
        <MenuItem onClick={handleMenuClick}>Compfy</MenuItem>
      </Menu>
    </AppBar>
  );

}

export default Header;