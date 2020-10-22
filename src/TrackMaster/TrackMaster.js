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
import Turnouts from '../Turnouts/Turnouts';
import Layout from '../Layout/Layout';
import MapControl from '../Layout/MapControl';
import Throttles from '../Throttles/Throttles';
import SelectLayout from '../Shared/SelectLayout/SelectLayout';
import ApiHost from '../Shared/ApiHost/ApiHost';
import ApiError from '../Shared/ApiError/ApiError';
import { MenuContext, menuConfig } from '../Shared/Context/MenuContext';
import { Context } from '../Store/Store';

import Loading from '../Shared/Loading/Loading';
import api, { getApiHost, apiStates } from '../Api';
import fetchLayout from '../Store/FetchLayout';
import jmriApi from '../Shared/jmri/jmriApi';
import './TrackMaster.scss';


function TrackMaster(props) {

  // api.emulator = true;
  
  let location = useLocation();
  let history = useHistory();

  const [ state, dispatch ] = useContext(Context);
  const { turnouts, layout, layoutStatus } = state;

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);
  const [apiHostOpen, setApiHostOpen] = useState(false);
  const [layoutId, setLayoutId] = useState(window.localStorage.getItem('layoutId'));
  const [jmriInitialized, setJmriInitialized] = useState(false);
  const [jmriReady, setJmriReady] = useState(false);
  const [turnoutsStatus, setTurnoutsStatus] = useState(apiStates.idle);

  useEffect(() => {
    const initJmri = async () => {
      jmriApi.on('ready', handleJmriReady.bind(this));
      const isSetup = await jmriApi.setup();
      setJmriInitialized(isSetup);
    }
    if (!jmriInitialized) {
      initJmri();
    }
  }, [jmriInitialized]);

  useEffect(() => {
    if (layoutId && layout === null && layoutStatus === apiStates.idle) {
      fetchLayout(layoutId, dispatch);
    } else {
      // show "select layout"
      console.log('select a layout');
    }
  }, [layoutId, dispatch]);

  console.log('turnouts', turnouts, state);

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnoutsStatus(apiStates.pending);
      try {
        const payload = await api.turnouts.get(layoutId);
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

  const handleJmriReady = isReady => {
    console.log('handleJmriReady', isReady);
    setJmriReady(isReady);
  }

  const handleNavigate = (event, newValue) => {
    setPage(newValue);
    history.push(newValue);
  }

  const handleSSLAuth = (event) => {
      window.open(getApiHost());
  }

  const handleTurnoutChange = async data => {
    for (let item of data) {
        let turnout = await api.turnouts.put(layoutId, item);
        await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    }
  }

  const handleEmulatorClick = () => { // TODO: move to settings
    if (!api.emulator) {
      api.emulator = true;
      Object.freeze(api);
    }
  }

  const handleMenuClick = menuChange => {
    const m = {...menu, ...menuChange};
    setMenu(m);
  }

  const handleApiClick = e => {
    setApiHostOpen(true);
  }

  const handleApiClose = e => {
    setApiHostOpen(false);
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
            <Turnouts turnouts={turnouts} turnoutsStatus={turnoutsStatus} onChange={handleTurnoutChange} />
          </Route>
        );
    }
  }

  console.log('TrackMaster', layoutStatus, layout);
  return (
    <MenuContext.Provider value={menu}>
        <ApiHost handleApiClose={handleApiClose} open={apiHostOpen} />
        <Box display="flex" flexDirection="column" height="100%" width="100%">
          <Box>
            <Header 
              page={page} 
              onSSLAuth={handleSSLAuth} 
              handleMenuClick={handleMenuClick} 
              handleApiClick={handleApiClick} 
              jmriApi={jmriApi}
              jmriReady={jmriReady}
              layout={layout}
            />
          </Box>
          <Box flexGrow={1} width="100%" alignContent="center" className="App-content" mt={1}>
              <SelectLayout open={!layoutId} setLayoutId={setLayoutId} />
              {(layoutStatus === apiStates.idle || layoutStatus === apiStates.pending) && (
                  <Loading />
              )}
              {layoutStatus === apiStates.error && (
                <ApiError handleEmulatorClick={handleEmulatorClick} />
              )}
              {layoutStatus === apiStates.done && (
                <Container maxWidth="lg" disableGutters={true} className="trackmaster__content-container">
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (<Redirect to={`/${layout.modules[0]}`} />)}
                    />
                    {layout.modules.map(getRoutedModule)}
                  </Switch>
                </Container>
              )}
          </Box>
          <Box mt={1}>
            <Footer page={page} onNavigate={handleNavigate} layout={layout} />
          </Box>
        </Box>
      </MenuContext.Provider>
  );
}

export default TrackMaster;
