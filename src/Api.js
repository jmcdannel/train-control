import * as Colors from 'material-ui/colors';
import blueLineImg from './Layout/images/IDAWANY-blueline.png';
import brownLineImg from './Layout/images/IDAWANY-brownline.png';
import greenLineImg from './Layout/images/IDAWANY-greenline.png';
import magentaLineImg from './Layout/images/IDAWANY-magentaline.png';
import orangeLineImg from './Layout/images/IDAWANY-orangeline.png';
import purpleLineImg from './Layout/images/IDAWANY-purpleline.png';
import redLineImg from './Layout/images/IDAWANY-redline.png';
import yellowLineImg from './Layout/images/IDAWANY-yellowline.png';

var emulatedTurnoutsData = require('./Shared/Utils/Emulator/turnouts.emulator.json');

async function createTurnout() {
  throw new Error('Not implemented');
}

async function readTurnout(turnoutId = null) {
  try {
    if (api.emulator) {
      return turnoutId !== null
        ? emulatedTurnoutsData.find(turnout => turnout.id === turnoutId)
        : emulatedTurnoutsData;
    }
    const response = turnoutId !== null
      ? await fetch(`${apiHost}/turnouts/${turnoutId}`)
      : await fetch(`${apiHost}/turnouts`);
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read Turnout(s)', turnoutId, `turnoutId=${turnoutId}`);
  }
}

async function updateTurnout(data) {
  try {
    if (api.emulator) {
      return emulatedTurnoutsData.map(turnout => {
        return (turnout.id === data.turnoutId) 
          ? Object.assign({}, turnout, data)
          : turnout;
      });
    }
    const response = await fetch(`${apiHost}/turnouts/${data.turnoutId}`, {
      method: 'PUT',
      cache: 'no-cache',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (err) {
    console.error(err)
    throw new Error('Unable to update Turnout', data);
  }
}

async function deleteTurnout(id) {
  throw new Error('Not implemented');
}

export const linesConfig = [
  { name: 'Red', color: Colors.red[500], img: redLineImg },
  { name: 'Green', color: Colors.green[500], img: greenLineImg },
  { name: 'Magenta', color: Colors.pink[500], img: magentaLineImg },
  { name: 'Yellow', color: Colors.yellow[500], img: yellowLineImg },
  { name: 'Orange', color: Colors.orange[500], img: orangeLineImg },
  { name: 'Blue', color: Colors.blue[500], img: blueLineImg },
  { name: 'Brown', color: Colors.brown[500], img: brownLineImg },
  { name: 'Purple', color: Colors.purple[500], img: purpleLineImg }
];

export const apiHost = 'http://192.168.86.22:5000';
// export const apiHost = 'http://localhost:5000';
// export const apiHost = 'http://0.0.0.0:5000';
// export const apiHost = 'https://traincontrol:5000';


export const api = {
  get: readTurnout,
  put: updateTurnout,
  post: createTurnout,
  delete: deleteTurnout
}

export default api;
