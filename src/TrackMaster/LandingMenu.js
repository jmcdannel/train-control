import React from 'react';
import Grid from '@material-ui/core/Grid';
import CallSplit from '@material-ui/icons/CallSplit';
import MapIcon from '@material-ui/icons/Map';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
// import SettingsIcon from '@material-ui/icons/Settings';
import TrainIcon from '@material-ui/icons/Train';
import navConfig from '../Shared/Config/navConfig';


function LandingMenu({ modules, onNavigate }) {

  const handleClick = (e, module) => {
    onNavigate(e, navConfig[module].link)
  }

  const getdModuleLink = module => {

    let moduleLink;
  
    switch(module) {
      case 'map' :
        moduleLink = (
          <>
            Map 
            <MapIcon />
          </>
        );
        break;
      case 'throttles' :
        moduleLink = (
          <>
            Throttles 
            <UnfoldMoreIcon />
          </>
        );
        break;
      case 'conductor' :
        moduleLink = (
          <>
            Conductor 
            <TrainIcon />
          </>
        );
        break;
        case 'turnouts' :
          moduleLink = (
            <>
              Turnouts 
              <CallSplit />
            </>
          );
          break;
    }
    return (
      <Grid item xs={6} className="trackmaster__menu-item" key={module}>
        <nav onClick={e => handleClick(e, module)}>
          {moduleLink}
        </nav>
      </Grid>
    );

    
  }

  return (
    <Grid container spacing={8}>

      {modules.filter(module => !!navConfig[module]).map(getdModuleLink)}
      
    </Grid>
  )

}

export default LandingMenu;