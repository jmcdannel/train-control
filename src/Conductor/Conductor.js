import React, { useState, useEffect, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import ConductorMenu from './ConductorMenu';
import Turnouts from '../Turnouts/Turnouts';
import Throttles from '../Throttles/Throttles';
import Effects from '../Effects/Effects';

import './Conductor.scss';

export const Conductor = props => {

  const defaultMenu = window.localStorage.getItem('menu') 
    ? JSON.parse(window.localStorage.getItem('menu'))
    : {
      view: 'pill',
      showMaps: true,
      group: '',
      lineFilters: [],
      sectionFilters: []
    };

  const [ menu, setMenu ] = useState(defaultMenu);

  useEffect(() => {
    window.localStorage.setItem('menu', JSON.stringify(menu));
  }, [menu])

  const handleMenuChange = event => {
    console.log('handleMenuChange', event);
    // window.localStorage.setItem('throttleView', event.target.value);
    setMenu({ ...menu, ...event });
  }

  const filterTurnouts = turnouts => {
    let filtered = [...turnouts];
    if (menu.lineFilters && menu.lineFilters.length > 0) {
      filtered = filtered.filter(t => menu.lineFilters.includes(t.line));
    }
    if (menu.sectionFilters && menu.sectionFilters.length > 0) {
      filtered = filtered.filter(t => menu.sectionFilters.includes(t.section));
    }
    console.log('filterTurnouts', turnouts, filtered, menu);
    return filtered;
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={6}>
        <Throttles />
      </Grid>
      <Grid item xs={6}>
        <ConductorMenu 
          onChange={handleMenuChange} 
          defaults={defaultMenu}
        />
        <h2>Turnouts</h2>
        <Turnouts 
          view={menu.view}
          groupBy={menu.group}
          filter={filterTurnouts} 
        />
        <h2>Effects</h2>
        <Effects
          view={menu.view} />
      </Grid>
    </Grid>

  )
};

export default Conductor;