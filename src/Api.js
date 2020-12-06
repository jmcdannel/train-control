import * as Colors from 'material-ui/colors';
import blueLineImg from './Layout/images/IDAWANY-blueline.png';
import brownLineImg from './Layout/images/IDAWANY-brownline.png';
import greenLineImg from './Layout/images/IDAWANY-greenline.png';
import magentaLineImg from './Layout/images/IDAWANY-magentaline.png';
import orangeLineImg from './Layout/images/IDAWANY-orangeline.png';
import purpleLineImg from './Layout/images/IDAWANY-purpleline.png';
import redLineImg from './Layout/images/IDAWANY-redline.png';
import yellowLineImg from './Layout/images/IDAWANY-yellowline.png';
import { getApi as getApiHostName, getConfig } from './config/config';

const appConfig = getConfig();
let apiHost = getApiHostName();

async function createTurnout() {
  throw new Error('Not implemented');
}

async function readTurnout(turnoutId = null) {
  try {
    const response = turnoutId !== null
      ? await fetch(`${apiHost}/turnouts/${turnoutId}`)
      : await fetch(`${apiHost}/turnouts`);
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read Turnout(s)', `turnoutId=${turnoutId}`);
  }
}

async function updateTurnout(data) {
  try {
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

async function deleteTurnout(turnoutId) {
  throw new Error('Not implemented', turnoutId);
}

async function readSignal(signalId = null) {
  try {
    const response = signalId !== null
      ? await fetch(`${apiHost}/signals/${signalId}`)
      : await fetch(`${apiHost}/signals`);
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read Signal(s)', `signalId=${signalId}`);
  }
}

async function readSensor(sensorId = null) {
  try {
    const response = sensorId !== null
      ? await fetch(`${apiHost}/sensors/${sensorId}`)
      : await fetch(`${apiHost}/sensors`);
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read Sensors(s)', `sensorId=${sensorId}`);
  }
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

export const apiStates = {
  idle: 'idle',
  pending: 'pending',
  done: 'done',
  error: 'error'
}

export const api = {
  turnouts: {
    get: readTurnout,
    put: updateTurnout,
    post: createTurnout,
    delete: deleteTurnout
  },
  signals: {
    get: readSignal
  },
  sensors: {
    get: readSensor
  }
}

export default api;
