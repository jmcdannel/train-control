import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading = () => {

  return (
    <CircularProgress color="primary" className="spinner" />
  )
}

export default Loading;