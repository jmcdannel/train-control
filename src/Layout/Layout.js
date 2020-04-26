import React, { useState } from 'react';
// import { ReactComponent as LayoutSVG } from './layout.svg';
import layoutSrc from './layout.svg'
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './Layout.scss';

function Layout() {

  const initialLines = [1,2,3,4].map(line => ({ line, visible: true }));

  const [lines, setLines] = useState(initialLines);
  const [showTurnouts, setShowTurnouts] = useState(true);

  const handleTurnoutSwitch = e => {
    setShowTurnouts(e.target.checked);
  }

  const toggleLine = _line => {
    const line = lines.find(line => line.line === _line.line);
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

            {lines.map(line => (
              <Chip
                key={line.line}
                avatar={<Avatar>{line.line}</Avatar>}
                label="Line"
                clickable
                color={`${line.visible ? 'secondary': 'default'}`}
                onClick={() => toggleLine(line)}
                onDelete={() => toggleLine(line)}
                deleteIcon={line.visible ? <DoneIcon /> : null}
                variant="outlined"
                className="line-toggle"
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
          <TransformWrapper width="100%">
            <TransformComponent width="100%">
              <img src={layoutSrc} className={getSVGClassName()} alt="test" width="100%" />
            </TransformComponent>
          </TransformWrapper>
        </Grid>
      </Grid>
    </Paper>
  );
}


export default Layout;