import React, { useState, useEffect, useContext } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
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
  const { signals, effects, sensors, turnouts } = state;

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);

  const [jmriInitialized, setJmriInitialized] = useState(false);
  const [sensorsInitialized, setSensorsInitialized] = useState(false);
  const [jmriReady, setJmriReady] = useState(false);


  useEffect(() => {
    const initialize = async function() {
      const apiInitState = await api.initialize();
      await dispatch({ type: 'INIT_STATE', payload: apiInitState });
    };
    
    initialize();
  }, []);

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
    if (!sensorsInitialized && jmriReady && sensors.length > 0) {
      console.log('watchSensors', sensors);
      jmriApi.watchSensors([...sensors]);
      jmriApi.on('sensor', 'TrackMaster', handleSensor);
      setSensorsInitialized(true);
    }
  }, [jmriApi, jmriReady, sensorsInitialized, sensors]);


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
    // for (let item of data) {
    //     let turnout = await api.turnouts.put(layoutId, item);
    //     await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    // }
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
      // case 'conductor' :
      //   return (
      //     <Route path="/map" key={module}>
      //       <MapControl turnouts={turnouts} onChange={handleTurnoutChange} />
      //     </Route>
      //   );
      case 'turnouts' :
        return (
          <Route path="/turnouts" key={module}>
            <Turnouts />
          </Route>
        );
      case 'signals' :
        return (
          <Route path="/signals" key={module}>
            <Signals signals={signals} sensors={sensors} />
          </Route>
        )
      case 'effects' :
        return (
          <Route path="/effects" key={module}>
            <Effects />
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
          <Box flexGrow={1} width="100%" height="100%" alignContent="center" className="App-content" mt={1}>

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

          </Box>
          <Box mt={1}>

            <Footer page={page} onNavigate={handleNavigate} modules={appConfig.modules} />

          </Box>
        </Box>
      </MenuContext.Provider>
  );
}

export default TrackMaster;
