import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CallSplit from '@material-ui/icons/CallSplit';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import Turnout from './Turnouts/Tunrout';
import Layout from './Layout/Layout';
import api from './Api';
// THEME
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './App.css';

const apiHost = 'http://0.0.0.0:5000';

function App() {

  const [page, setPage] = useState('Turnouts');

  const [turnouts, setTurnouts] = useState({ data: null, status: 'idle' });

  const testconfig = {
    showSettings: true
  }

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnouts({...turnouts, status: 'pending' });
      const response = await api.get();
      setTurnouts({...turnouts, data: response, status: 'done' });
    }
    if (turnouts.data === null && turnouts.status === 'idle') {
      fetchTurnouts();
    }
  }, [turnouts]);

  function navigate(event, newValue) {
    setPage(newValue);
  }

  const getTurnoutById = id => turnouts.data.find(t => id === t.id);

  const getLinkedTurnout = turnout => 
    turnout.crossover
      ? getTurnoutById(turnout.crossover)
      : turnout.reverse
        ? getTurnoutById(turnout.reverse)
        : null;

  return (
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box flexGrow={0} >
        <AppBar >
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1}}>
              {page}
            </Typography>
          </Toolbar>
        </AppBar>
        </Box>
        <Box flexGrow={1} mt={'94px'} width="100%" alignContent="center">
          <Container maxWidth="lg">
            {page === 'Turnouts' && (
              <Grid container spacing={2}>
                {turnouts.data && turnouts.data.map(turnout => (
                  <Grid key={turnout.id} item sm={6} xs={12}><Turnout config={turnout} linked={getLinkedTurnout(turnout)} /></Grid>
                ))}
              </Grid>
            )}
            {page === 'Layout' && (<Layout />)}
            {page === 'Settings' && (
              <Grid container spacing={1}>
                <p>Settings</p>
              </Grid>
            )}
          </Container>
        </Box>
        <Box flexGrow={0}>
          <BottomNavigation
            value={page}
            onChange={navigate}
            showLabels
          >
            <BottomNavigationAction label="Turnouts" value="Turnouts" icon={<CallSplit />} />
            <BottomNavigationAction label="Layout" value="Layout" icon={<MapIcon />} />
            {/* <BottomNavigationAction label="Settings" value="Settings" icon={<SettingsIcon />} /> */}
          </BottomNavigation>
        </Box>
      </Box>
    </MuiThemeProvider>
    
  );
}

export default App;
