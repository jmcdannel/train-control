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
import Conductor from '../Conductor/Conductor';
import Turnouts from '../Turnouts/Turnouts';
import Layout from '../Layout/Layout';
import MapControl from '../Layout/MapControl';
import Throttles from '../Throttles/Throttles';
import Signals from '../Signals/Signals';
import Effects from '../Effects/Effects';
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
  const { turnouts, signals, effects, sensors } = state;

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);

  const [jmriInitialized, setJmriInitialized] = useState(false);
  const [sensorsInitialized, setSensorsInitialized] = useState(false);
  const [jmriReady, setJmriReady] = useState(false);

  // TODO: onload load if module in config
  const [turnoutsStatus, setTurnoutsStatus] = useState(apiStates.idle);
  const [signalsStatus, setSignalsStatus] = useState(apiStates.idle);
  const [effectsStatus, setEffectsStatus] = useState(apiStates.idle);
  const [sensorsStatus, setSensorsStatus] = useState(apiStates.idle);

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


  useEffect(() => {
    if (!sensorsInitialized && jmriReady && sensorsStatus === apiStates.done && sensors.length > 0) {
      console.log('watchSensors', sensors);
      jmriApi.watchSensors([...sensors]);
      jmriApi.on('sensor', 'TrackMaster', handleSensor);
      setSensorsInitialized(true);
    }
  }, [jmriApi, jmriReady, sensorsInitialized, sensors, sensorsStatus]);

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

 // TODO: onload load if module in config
useEffect(() => {
  const fetchEffects = async () => {
    setEffectsStatus(apiStates.pending);
    try {
      const payload = await api.effects.get();
      await dispatch({ type: 'UPDATE_EFFECTS', payload });
      setEffectsStatus(apiStates.done)
    } catch(err) {
      console.error(err);
      setEffectsStatus(apiStates.error)
    }
  }
  if ((effects && effects.length === 0) && effectsStatus === 'idle') {
    fetchEffects();
  }
}, [effects, effectsStatus]);

// TODO: onload load if module in config
useEffect(() => {
 const fetchSignals = async () => {
   setSignalsStatus(apiStates.pending);
   try {
     const payload = await api.signals.get();
     await dispatch({ type: 'UPDATE_SIGNALS', payload });
     setSignalsStatus(apiStates.done)
   } catch(err) {
     console.error(err);
     setSignalsStatus(apiStates.error)
   }
 }
 if (layoutId && (signals && signals.length === 0) && signalsStatus === 'idle') {
   fetchSignals();
 }
}, [signals, signalsStatus, layoutId]);

// TODO: onload load if module in config
useEffect(() => {
 const fetchSensors = async () => {
   setSensorsStatus(apiStates.pending);
   try {
     const payload = await api.sensors.get();
     await dispatch({ type: 'UPDATE_SENSORS', payload });
     setSensorsStatus(apiStates.done)
   } catch(err) {
     console.error(err);
     setSensorsStatus(apiStates.error)
   }
 }
 if (layoutId && (sensors && sensors.length === 0) && sensorsStatus === 'idle') {
  fetchSensors();
 }
}, [sensors, sensorsStatus, layoutId]);

  // Event Handlers
  const handleJmriReady = isReady => {
    setJmriReady(isReady);
  }

  const handleSensor = ({ name, inverted, state }) =>{
    const setSignal = (action, actionState) => {
      if (actionState === 4) {
        api.signals.put({ 
          signalId: action.signalId, 
          state: actionState === 4 ? 1 :0 
        });
      }
      return action;
    }
    const sensor = sensors.find(sensor => sensor.pin == parseInt(name.substring(2)));
    sensor.HIGH.map(sensorAction => setSignal(sensorAction, state));
    sensor.LOW.map(sensorAction => setSignal(sensorAction, state));
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
      case 'signals' :
        return (
          <Route path="/signals" key={module}>
            <Signals signals={signals} sensors={sensors} signalsStatus={signalsStatus} sensorsStatus={sensorsStatus} />
          </Route>
        )
      case 'effects' :
        return (
          <Route path="/effects" key={module}>
            <Effects effects={effects} sensors={sensors} effectsStatus={effectsStatus} sensorsStatus={sensorsStatus} />
          </Route>
        )
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
                <Route path="/conductor" exact>
                  <Conductor />
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
