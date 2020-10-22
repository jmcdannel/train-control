import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import navConfig from '../Shared/Config/navConfig';

export const Footer = props => {

  const { page, layout, onNavigate: handleNavigate } = props;

  return (
    <BottomNavigation
      value={page}
      className="App-footer"
      onChange={handleNavigate}
    >
      {layout && layout.modules && layout.modules.map(module => (
        <BottomNavigationAction key={module} label={navConfig[module].label} value={`${navConfig[module].link}`} icon={navConfig[module].icon} />
      ))}
      {/* <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} /> */}
    </BottomNavigation>
  );

}

export default Footer;