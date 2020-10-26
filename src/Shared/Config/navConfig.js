import React from 'react';
import CallSplit from '@material-ui/icons/CallSplit';
import MapIcon from '@material-ui/icons/Map';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
// import SettingsIcon from '@material-ui/icons/Settings';
import TrainIcon from '@material-ui/icons/Train';

export const navConfig = {
  map: { link: '/map', label: 'Layout', icon: (<MapIcon />) },
  conductor: { link: '/conductor', label: 'Conductor', icon: (<TrainIcon />) },
  turnouts: { link: '/turnouts', label: 'Turnouts', icon: (<CallSplit />) },
  throttles: { link: '/throttles', label: 'Throttle', icon: (<UnfoldMoreIcon />) },
  'train-control': { link: '/train-control', label: 'Train Control', icon: (<TrainIcon />) },
}

export const getByLink = link => {
  const item = Object.keys(navConfig).reduce(function(result, curr) {
    if (navConfig[curr].link === link) {
      result = navConfig[curr];
    }
    return result;
  }, null);
  return item;
};

export default navConfig;