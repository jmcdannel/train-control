import React from 'react';

export const menuConfig = {
  '/turnouts': {
    view: 'compact',
    on: false
  }
}

export const MenuContext = React.createContext(menuConfig);

export default MenuContext;
