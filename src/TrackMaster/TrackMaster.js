import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
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
import Store, { Context } from '../Store/Store';

import Loading from '../Shared/Loading/Loading';
import api, { getApiHost } from '../Api';
import jmriApi from '../Shared/jmri/jmriApi';
import './TrackMaster.scss';


function TrackMaster(props) {

  // api.emulator = true;
  
  let location = useLocation();
  let history = useHistory();

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);
  const [apiHostOpen, setApiHostOpen] = useState(false);
  const [layoutId, setLayoutId] = useState(window.localStorage.getItem('layoutId'));
  const [jmriInitialized, setJmriInitialized] = useState(false);
  const [jmriReady, setJmriReady] = useState(false);
  const [layout, setLayout] = useState({ data: null, status: 'idle' });
  const [turnouts, setTurnouts] = useState({ data: null, status: 'idle' });
  const [turnoutList, setTurnoutList] = useState([]);

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
    const fetchLayout = async () => {
      setLayout({...layout, status: 'pending' });
      try {
        const response = await api.layouts.get(layoutId);
        console.log('fetchLayout', response);
        setLayout({...layout, data: response, status: 'done' });
      } catch(err) {
        console.error('fetchLayout', err);
        setLayout({...layout, status: 'error' });
      }
    }
    if (layoutId && layout.data === null && layout.status === 'idle') {
      fetchLayout();
    } else {
      // show "select layout"
      console.log('select a layout');
    }
  }, [layoutId])

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnouts({...turnouts, status: 'pending' });
      try {
        const response = await api.turnouts.get(layoutId);
        setTurnouts({...turnouts, data: response, status: 'done' });
      } catch(err) {
        setTurnouts({...turnouts, status: 'error' });
      }
    }
    if (layoutId && turnouts.data === null && turnouts.status === 'idle') {
      fetchTurnouts();
    } else {
      setTurnoutList(turnouts.data);
    }
  }, [turnouts, layoutId]);

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
    async function getResults() {
      let results = [];
      for (let item of data) {
          let turnout = await api.turnouts.put(layoutId, item);
          results.push(turnout);
      }
      return results;
    } 

    getResults().then(results => {
      const newTurnouts = turnoutList.map(t => {
        const match = results.find(r => r.turnoutId === t.turnoutId);
        return match ? {...t, ...match} : t;
      });
      setTurnoutList([...newTurnouts]);
    });
  }

  const handleEmulatorClick = () => {
    if (!api.emulator) {
      api.emulator = true;
      Object.freeze(api);
    }
    setTurnouts({...turnouts, data: null, status: 'idle'});
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

  return (
    <Store >
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
              <Box>
                <SelectLayout open={!layoutId} setLayoutId={setLayoutId} />
                {(turnouts.status  === 'idle' || turnouts.status === 'pending') && (
                    <Loading />
                )}
                {turnouts.status  === 'error' && (
                  <ApiError handleEmulatorClick={handleEmulatorClick} />
                )}
                {turnouts.status  === 'done' && (
                  <Container maxWidth="lg" disableGutters={true} className="trackmaster__content-container">
                    <Switch>
                      <Route path="/layout">
                        <Layout turnouts={turnoutList} />
                      </Route>
                      <Route path="/throttles">
                        <Throttles jmriApi={jmriApi} />
                      </Route>
                      <Route path="/conductor">
                        <MapControl turnouts={turnoutList} onChange={handleTurnoutChange} />
                      </Route>
                      <Route path={["/", "/turnouts"]}>
                        <Turnouts turnoutList={turnoutList} onChange={handleTurnoutChange} />
                      </Route>
                    </Switch>
                  </Container>
                )}
                </Box>
            </Box>
            <Box mt={1}>
              <Footer page={page} onNavigate={handleNavigate} />
            </Box>
          </Box>
        </MenuContext.Provider>
      </Store>
  );
}

export default TrackMaster;
