import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import api, { getApiHost, setApiHost, getApiHostOptions } from '../../Api';

export function ApiHost(props) {

  const { open, handleApiClose } = props;
  const [ customApi, setCustomApi ] = useState('');

  const handleHostClick = host => {
    setApiHost(host);
    handleApiClose();
  }

  const hanldeCustomApiChange = e => {
    setCustomApi(e.target.value);
  }

  const handleApiCustom = e => {
    console.log('handleApiCustom', customApi);
    setApiHost(customApi);
    handleApiClose();
  }

  return (
    <Dialog open={open} onClose={handleApiClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">API Host</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Current Host: <pre>{getApiHost()}</pre>
          </DialogContentText>
          <MenuList>
            {getApiHostOptions().map(host => (
              <MenuItem  onClick={() => handleHostClick(host)}>{host}</MenuItem>
            ))}
          </MenuList>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Custom API Host"
            type="url"
            fullWidth
            value={customApi}
            onChange={hanldeCustomApiChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApiClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApiCustom} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );

}

export default ApiHost;
