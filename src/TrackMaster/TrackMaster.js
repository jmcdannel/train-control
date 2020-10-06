import React, { useState, useEffect, useContext } from 'react';
import {
  Switch,
  Route,
  Link,
  useHistory,
  useLocation
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import Header from './Header';
import Footer from './Footer';
import Turnouts from '../Turnouts/Turnouts';
import Layout from '../Layout/Layout';
import MapControl from '../Layout/MapControl';
import Throttles from '../Throttles/Throttles';
import { MenuContext, menuConfig } from '../Shared/Context/MenuContext';
import api, { apiHost } from '../Api';
import './TrackMaster.scss';


function TrackMaster(props) {

  api.emulator = true;
  
  let apiEndpoint = '';
  let location = useLocation();
  let history = useHistory();

  console.log('location', location);

  const [page, setPage] = useState(location && location.pathname);
  // const [page, setPage] = useState('Layout');
  const [menu, setMenu] = useState(menuConfig);

  const [turnouts, setTurnouts] = useState({ data: null, status: 'idle' });
  const [turnoutList, setTurnoutList] = useState([]);

  useEffect(() => {
    const fetchTurnouts = async () => {
      setTurnouts({...turnouts, status: 'pending' });
      try {
        console.log('f');
        const response = await api.get();
        console.log('response', response);
        console.log('formatResponse', formatResponse(response));
        setTurnouts({...turnouts, data: formatResponse(response), status: 'done' });
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

  const handleNavigate = (event, newValue) => {
    setPage(newValue);
    history.push(newValue);
  }

  const handleSSLAuth = (event) => {
      window.open(apiHost);
  }

  const formatResponse = response => {
    response.forEach(turnout => {
      turnout['turnoutId'] = turnout['id'];
      // delete turnout['id'];
    });
    return response;
  }

  const handleTurnoutChange = async data => {
    debugger;
    async function getResults() {
      let results = [];
      for (let item of data) {
          let r = await api.put(item);
          results = r;
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

  const handleEmulatorClick = event => {
    console.log('handleEmulatorClick', api.emulator);
    if (!api.emulator) {
      api.emulator = true;
      Object.freeze(api);
    }
    setTurnouts({...turnouts, data: null, status: 'idle'});
  }

  const handleMenuClick = menuChange => {
    console.log(menuChange);
    const m = {...menu};
    m[menuChange.menu] = {...m[menuChange.menu], ...menuChange.state};
    console.log(m);
    setMenu(m);
  }


        console.log('turnoutList', turnoutList);
  return (
    <MenuContext.Provider value={menu}>
      <Box display="flex" flexDirection="column" height="100%" width="100%">
        <Box  >
          <Header page={page} onSSLAuth={handleSSLAuth} handleMenuClick={handleMenuClick} />
        </Box>
        <Box flexGrow={1} width="100%" alignContent="center" className="App-content" mt={1}>
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
          {turnouts.status  === 'idle' || turnouts.status === 'pending' && (
              <CircularProgress color="primary" className="spinner" />
          )}
          {turnouts.status  === 'error' && (
            <Container maxWidth="lg">
              <Grid container spacing={1}>
                <Box p={2}>
                  <h1>Error: could not load turnouts. Check settings and make sure the API host is running.</h1>
                  <Button variant="outlined" onClick={handleEmulatorClick}>
                      Eanble Emulator
                  </Button>
                </Box>
              </Grid>
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
