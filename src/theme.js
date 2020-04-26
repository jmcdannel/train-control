import { createMuiTheme } from '@material-ui/core/styles';
import * as Colors from 'material-ui/colors';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
    primary: Colors.red,
    secondary: Colors.lightGreen
  },
  background: {
    default: Colors.grey[900]
  },
});

export default theme;

// import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';


// const theme = createMuiTheme({
//   spacing: () => '8px',
//   palette: {
//     type: 'dark',
//     primary: Colors.red500,
//     secondary: Colors.lightGreenA200,
//   }
// });

// export default theme;
