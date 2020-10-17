import React, { useState, useEffect, useContext } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import CircularProgress from '@material-ui/core/CircularProgress';

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
import api, { getApiHost } from '../Api';
import './TrackMaster.scss';


function TrackMaster(props) {

  // api.emulator = true;
  
  let location = useLocation();
  let history = useHistory();

  const [page, setPage] = useState(location && location.pathname);
  const [menu, setMenu] = useState(menuConfig);
  const [apiHostOpen, setApiHostOpen] = useState(false);
  const [layoutId, setLayoutId] = useState(window.localStorage.getItem('layoutId'));

  const [turnouts, setTurnouts] = useState({ data: null, status: 'idle' });
  const [turnoutList, setTurnoutList] = useState([]);

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
  }, [turnouts]);

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
    <MenuContext.Provider value={menu}>
      <ApiHost handleApiClose={handleApiClose} open={apiHostOpen} />
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Box>
          <Header 
            page={page} 
            onSSLAuth={handleSSLAuth} 
            handleMenuClick={handleMenuClick} 
            handleApiClick={handleApiClick} 
          />
        </Box>
        <Box flexGrow={1} width="100%" alignContent="center" className="App-content" mt={1}>
          
            <SelectLayout open={!layoutId} setLayoutId={setLayoutId} />
          {turnouts.status  === 'idle' || turnouts.status === 'pending' && (
              <CircularProgress color="primary" className="spinner" />
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
                  <Throttles />
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
        <Box mt={1}>
          <Footer page={page} onNavigate={handleNavigate} />
        </Box>
      </Box>
      </MenuContext.Provider>
  );
}

export default TrackMaster;
