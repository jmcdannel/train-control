import React, { useState, useEffect, useContext } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Header from './Header';
import Footer from './Footer';

// Modules
import Turnouts from '../Turnouts/Turnouts';
import Layout from '../Layout/Layout';
import MapControl from '../Layout/MapControl';
import Throttles from '../Throttles/Throttles';
import MiniThrottles from '../Throttles/MiniThrottles';
import LandingMenu from './LandingMenu';

// Store
import { MenuContext, menuConfig } from '../Shared/Context/MenuContext';
import { Context } from '../Store/Store';

// APIs
import { getJmri , getApiHost, getConfig } from '../config/config';
import api, { apiStates } from '../Api';
import jmriApi from '../Shared/jmri/jmriApi';

import './TrackMaster.scss';

function TrackMaster(props) {

  let location = useLocation();
  let history = useHistory();

  const appConfig = getConfig();
  const layoutId = appConfig.layoutId;

  const [ state, dispatch ] = useContext(Context);
  const { turnouts } = state;

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);

  const [jmriInitialized, setJmriInitialized] = useState(false);
  const [jmriReady, setJmriReady] = useState(false);

  // TODO: onload load if module in config
  const [turnoutsStatus, setTurnoutsStatus] = useState(apiStates.idle);

  // Initialize JMRI Websocket connection
  useEffect(() => {
    const initJmri = async () => {
      jmriApi.on('ready', 'TrackMaster', handleJmriReady.bind(this));
      const isSetup = await jmriApi.setup(getJmri());
      setJmriInitialized(isSetup);
    }
    if (!jmriInitialized) {
      initJmri();
    }
  }, [jmriInitialized]);

   // TODO: onload load if module in config
  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnoutsStatus(apiStates.pending);
      try {
        const payload = await api.turnouts.get();
        await dispatch({ type: 'UPDATE_TURNOUTS', payload });
        setTurnoutsStatus(apiStates.done)
      } catch(err) {
        console.error(err);
        setTurnoutsStatus(apiStates.error)
      }
    }
    if (layoutId && (turnouts && turnouts.length === 0) && turnoutsStatus === 'idle') {
      fetchTurnouts();
    }
  }, [turnouts, turnoutsStatus, layoutId]);

  // Event Handlers
  const handleJmriReady = isReady => {
    setJmriReady(isReady);
  }

  const handleNavigate = (event, newValue) => {
    setPage(newValue);
    history.push(newValue);
  }

  // Deprecate(d)
  const handleSSLAuth = (event) => {
      window.open(getApiHost());
  }

  const handleTurnoutChange = async data => {
    for (let item of data) {
        let turnout = await api.turnouts.put(layoutId, item);
        await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    }
  }

  const handleMenuClick = menuChange => {
    const m = {...menu, ...menuChange};
    setMenu(m);
  }

  const getRoutedModule = module => {
    switch(module) {
      case 'map' :
        return (
          <Route path="/map" key={module}>
            <Layout turnouts={turnouts} />
          </Route>
        );
      case 'throttles' :
        return (
          <Route path="/throttles" key={module}>
            <Throttles jmriApi={jmriApi} />
          </Route>
        );
      case 'conductor' :
        return (
          <Route path="/conductor" key={module}>
            <MapControl turnouts={turnouts} onChange={handleTurnoutChange} />
          </Route>
        );
      case 'turnouts' :
        return (
          <Route path="/turnouts" key={module}>
            <Turnouts turnouts={turnouts} turnoutsStatus={turnoutsStatus} />
          </Route>
        );
    }
    // TODO: add signals
  }

  return (
    <MenuContext.Provider value={menu}>
        <Box display="flex" flexDirection="column" height="100%" width="100%">
          <Box>

            <Header 
              page={page} 
              onSSLAuth={handleSSLAuth} 
              handleMenuClick={handleMenuClick} 
              jmriApi={jmriApi}
              jmriReady={jmriReady}
            />
            <MiniThrottles locos={state.locos} jmriApi={jmriApi} />
            
          </Box>
          <Box flexGrow={1} width="100%" alignContent="center" className="App-content" mt={1}>

            <Container maxWidth="lg" disableGutters={true} className="trackmaster__content-container">
              <Switch>
                <Route path="/" exact>
                  <LandingMenu modules={appConfig.modules} onNavigate={handleNavigate} />
                </Route>
                <Route path="/train-control" exact>
                  <LandingMenu modules={appConfig.modules} onNavigate={handleNavigate} />
                </Route>
                {appConfig.modules.map(getRoutedModule)}
              </Switch>
            </Container>

          </Box>
          <Box mt={1}>

            <Footer page={page} onNavigate={handleNavigate} modules={appConfig.modules} />

          </Box>
        </Box>
      </MenuContext.Provider>
  );
}

export default TrackMaster;
