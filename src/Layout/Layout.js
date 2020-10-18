import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { linesConfig } from '../Api';
import baseImg from './images/IDAWANY-base.png';
import switchesImg from './images/IDAWANY-switches.png';
// import idawahnyImg from './images/IDAWANY.png';
import './Layout.scss';

function Layout(props) {

  const hideLines = ['Brown', 'Blue', 'Purple'];
  const initialLines = linesConfig.map(line => ({ visible: !hideLines.includes(line.name), ...line }));

  const [lines, setLines] = useState(initialLines);
  const [showTurnouts, setShowTurnouts] = useState(false);

  const handleTurnoutSwitch = e => {
    setShowTurnouts(e.target.checked);
  }

  const toggleLine = _line => {
    const line = lines.find(line => line.name === _line.name);
    line.visible = !line.visible;
    setLines([...lines]);
  }

  const getSVGClassName = () => {
    const classes = 
      lines.filter(line => line.visible).map(line => `show-line-${line.line}`);
    if (showTurnouts) {
      classes.push('show-turnouts');
    }
    return `layout-img ${classes.join(' ')}`;
  }

  return (
    <Paper>
      <Grid container width="100%" direction="row" >
        <Grid item xs={12} sm={2} className="filters">
          
          <Box>
            <Typography component="h5" variant="h5" gutterBottom>
              Lines
            </Typography>

            {lines.map((line, idx) => (
              <Chip
                key={idx}
                label={`${line.name} Line`}
                variant="outlined"
                className="line-toggle"
                style={{ backgroundColor: line.color, opacity: line.visible ? 1 : 0.3 }}
                onClick={() => toggleLine(line)}
                onDelete={() => toggleLine(line)}
                deleteIcon={line.visible ? <DoneIcon /> : null}
                clickable
              />
            ))}
            <FormGroup>
              <FormControlLabel control={
                <Switch value="showTurnouts" onChange={handleTurnoutSwitch} checked={showTurnouts} />
              } label="Show Turnouts" />
            </FormGroup>
          </Box>

        </Grid>
        <Grid item xs={12} sm={10}>
          <TransformWrapper width="100%" options={{
          }}>
            <TransformComponent width="100%">
              <div className={getSVGClassName()}>
                <img src={baseImg} className="layout-base-layer"  alt="test" width="100%" />
                {lines.filter(line => line.visible).map((line, idx) => (
                  <img key={idx} src={line.img} className="layout-layer" alt="test" width="100%" />
                ))}
                {showTurnouts && (<img src={switchesImg} className="layout-layer" alt="test" width="100%" />)}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Layout;
