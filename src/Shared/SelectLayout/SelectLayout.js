import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import api, { getApiHost, setApiHost, getApiHostOptions } from '../../Api';

export function SelectLayout(props) {

  const { open, handleLayoutClose, setLayoutId } = props;
  const [ layouts, setLayouts] = useState({ data: null, status: 'idle' });
  
  useEffect(() => {
    const fetchLayouts = async () => {
      setLayouts({...layouts, status: 'pending' });
      try {
        const response = await api.layouts.get();
        setLayouts({...layouts, data: response, status: 'done' });
      } catch(err) {
        setLayouts({...layouts, status: 'error' });
      }
    }
    if (layouts.data === null && layouts.status === 'idle') {
      fetchLayouts();
    }
  }, [layouts]);

  const handleLayoutClick = layoutId => {
    window.localStorage.setItem('layoutId', layoutId);
    setLayoutId(layoutId);
    handleLayoutClose();
  }

  return (
    <Dialog open={open} onClose={handleLayoutClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Layout</DialogTitle>
        <DialogContent>
            {layouts.status  === 'idle' || layouts.status === 'pending' && (
              <CircularProgress color="primary" className="spinner" />
            )}
            {layouts.status  === 'error' && (
                <code>Error</code>
            )}
            {layouts.status  === 'done' && (
            //   <DialogContentText>
            //     Current Host: <pre>{getApiHost()}</pre>
            //   </DialogContentText>
            <MenuList>
                {layouts.data.map(layout => (
                <MenuItem  onClick={() => handleLayoutClick(layout.layoutId)}>{layout.name}</MenuItem>
                ))}
            </MenuList>
          )}
        </DialogContent>
      </Dialog>
  );

}

export default SelectLayout;
