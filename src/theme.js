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
