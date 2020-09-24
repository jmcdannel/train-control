import React from 'react';
import { Switch, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

import TrackMaster from './TrackMaster/TrackMaster';
import Login from './Login/Login';
// THEME
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import './App.css';

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <TrackMaster />
        </Route>
      </Switch>
    </MuiThemeProvider>
  );
}

export default App;
