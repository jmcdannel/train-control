import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CallSplit from '@material-ui/icons/CallSplit';
import MapIcon from '@material-ui/icons/Map';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
// import SettingsIcon from '@material-ui/icons/Settings';
import TrainIcon from '@material-ui/icons/Train';

export const Footer = props => {

  const { page, onNavigate: handleNavigate } = props;

  return (
    <BottomNavigation
      value={page}
      // showlabels
      className="App-footer"
      onChange={handleNavigate}
    >
      <BottomNavigationAction label="Conductor" value="/conductor" icon={<TrainIcon />} />
      <BottomNavigationAction label="Turnouts" value="/turnouts" icon={<CallSplit />} />
      <BottomNavigationAction label="Throttle" value="/throttles" icon={<UnfoldMoreIcon />} />
      <BottomNavigationAction label="Layout" value="/layout" icon={<MapIcon />} />
      {/* <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} /> */}
    </BottomNavigation>
  );

}

export default Footer;