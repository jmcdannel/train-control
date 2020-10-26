import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../Api';

export function SelectLayout(props) {

  const { open, setLayoutId } = props;
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
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Layout</DialogTitle>
        <DialogContent>
            {(layouts.status  === 'idle' || layouts.status === 'pending') && (
              <CircularProgress color="primary" className="spinner" />
            )}
            {layouts.status  === 'error' && (
                <code>Error</code>
            )}
            {layouts.status  === 'done' && (
            <MenuList>
                {layouts.data.map(layout => (
                <MenuItem key={layout.layoutId}  onClick={() => handleLayoutClick(layout.layoutId)}>{layout.name}</MenuItem>
                ))}
            </MenuList>
          )}
        </DialogContent>
      </Dialog>
  );

}

export default SelectLayout;
