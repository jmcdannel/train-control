import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TrainIcon from '@material-ui/icons/Train';
import navConfig from '../Shared/Config/navConfig';

export const Footer = props => {

  const { page, modules, onNavigate: handleNavigate } = props;

  return (
    <BottomNavigation
      value={page}
      className="App-footer"
      onChange={handleNavigate}
    >
      <BottomNavigationAction label="Conductor" value="/conductor" icon={<TrainIcon />} />
      {modules && modules.filter(module => !!navConfig[module]).map(module => (
        <BottomNavigationAction key={module} label={navConfig[module].label} value={`${navConfig[module].link}`} icon={navConfig[module].icon} />
      ))}
      {/* <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} /> */}
    </BottomNavigation>
  );

}

export default Footer;