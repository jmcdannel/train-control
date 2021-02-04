import React from 'react';
import { Switch, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import TrackMaster from './TrackMaster/TrackMaster';
import Login from './Login/Login';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Store from './Store/Store';
import theme from './theme';
import './App.scss';

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <Store>
        <CssBaseline />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <TrackMaster />
          </Route>
        </Switch>
      </Store>
    </MuiThemeProvider>
  );
}

export default App;
