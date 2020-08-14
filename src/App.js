import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CallSplit from '@material-ui/icons/CallSplit';
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from '@material-ui/icons/Settings';
import TrainIcon from '@material-ui/icons/Train';
import Turnout from './Turnouts/Tunrout';
import Layout from './Layout/Layout';
import MapControl from './Layout/MapControl';
import api from './Api';
// THEME
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './App.css';

function App() {

  const [page, setPage] = useState('Conductor');
  // const [page, setPage] = useState('Layout');

  const [turnouts, setTurnouts] = useState({ data: null, status: 'idle' });
  const [turnoutList, setTurnoutList] = useState([]);

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnouts({...turnouts, status: 'pending' });
      try {
        const response = await api.get();
        setTurnouts({...turnouts, data: response, status: 'done' });
      } catch(err) {
        setTurnouts({...turnouts, status: 'error' });
      }
    }
    if (turnouts.data === null && turnouts.status === 'idle') {
      fetchTurnouts();
    } else {
      setTurnoutList(turnouts.data);
  }
  }, [turnouts]);

  const navigate = (event, newValue) => {
    setPage(newValue);
  }

  const handleChange = async data => {
    async function getResults() {
      let results = [];
      for (let item of data) {
          let r = await api.put(item);
          results.push(r);
      }
      return results;
    } 

    getResults().then(results => {
      const newTurnouts = turnoutList.map(t => {
        const match = results.find(r => r.id === t.id);
        return match ? {...t, ...match} : t;
      });
      setTurnoutList([...newTurnouts]);
    });

  }

  const getTurnoutById = id => turnoutList.find(t => id === t.id);

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
      <Box  >
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6">
              {page}
            </Typography>
          </Toolbar>
        </AppBar>
        </Box>
        
        <Box flexGrow={1} width="100%" alignContent="center" className="App-content" mt={1}>
            {turnouts.status  === 'done' && (
                <Container maxWidth="lg">
                    {page === 'Turnouts' && (
                    <Grid container spacing={2}>
                        {turnoutList && turnoutList.map(turnout => (
                        <Grid key={turnout.id} item sm={6} xs={12}>
                            <Turnout 
                            config={turnout} 
                            linked={getLinkedTurnout(turnout)}
                            onChange={handleChange} />
                        </Grid>
                        ))}
                    </Grid>
                    )}
                    {page === 'Layout' && (<Layout turnouts={turnoutList} />)}
                    {page === 'Settings' && (
                    <Grid container spacing={1}>
                        <p>Settings</p>
                    </Grid>
                    )}
                    {page === 'Conductor' && (<MapControl turnouts={turnoutList} onChange={handleChange} />)}
                </Container>
            )}
            {turnouts.status  === 'idle' || turnouts.status === 'pending' && (
                <CircularProgress color="primary" className="spinner" />
            )}
            {turnouts.status  === 'error' && (
                <h1>Error: could not load turnouts. Check settings and make sure the API host is running.</h1>
            )}
        </Box>
        
        <Box mt={1}>
          <BottomNavigation
            value={page}
            onChange={navigate}
            showLabels
            className="App-footer"
          >
          <BottomNavigationAction label="Conductor" value="Conductor" icon={<TrainIcon />} />
            <BottomNavigationAction label="Turnouts" value="Turnouts" icon={<CallSplit />} />
            <BottomNavigationAction label="Layout" value="Layout" icon={<MapIcon />} />
          </BottomNavigation>
        </Box>
      </Box>
    </MuiThemeProvider>
    
  );
}

export default App;
