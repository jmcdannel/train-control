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

const appConfig = getConfig();
let apiHost = getApiHostName();

async function get(type, Id = null) {
  try {
    const response = Id !== null
      ? await fetch(`${apiHost}/${type}s/${Id}`)
      : await fetch(`${apiHost}/${type}s`);
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Unable to read', type, `Id=${Id}`);
  }
}

async function put(type, data) {
  try {
    const response = await fetch(`${apiHost}/${type}s/${data[`${type}Id`]}`, {
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
    throw new Error('Unable to update', type, data);
  }
}

export const apiStates = {
  idle: 'idle',
  pending: 'pending',
  done: 'done',
  error: 'error'
}

const getMethod = verb => {
  switch(verb) {
    case 'get':
      return get;
    case 'put':
      return put;
  }
}

export const api = {
  get,
  put,
  turnouts: {
    get: args => get('turnout', args),
    put: args => put('turnout', args)
  },
  signals: {
    get: args => get('signal', args),
    put: args => put('signal', args)
  },
  sensors: {
    get: args => get('sensor', args)
  }
}

export default api;

// async function readTurnout(turnoutId = null) {
//   return read('turnouts', turnoutId);
// }

// async function updateTurnout(data) {
//   return update('turnouts', data);
//   try {
//     const response = await fetch(`${apiHost}/turnouts/${data.turnoutId}`, {
//       method: 'PUT',
//       cache: 'no-cache',
//       crossDomain: true,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     });
//     return await response.json();
//   } catch (err) {
//     console.error(err)
//     throw new Error('Unable to update Turnout', data);
//   }
// }

// async function deleteTurnout(turnoutId) {
//   throw new Error('Not implemented', turnoutId);
// }

// async function readSignal(signalId = null) {
//   try {
//     const response = signalId !== null
//       ? await fetch(`${apiHost}/signals/${signalId}`)
//       : await fetch(`${apiHost}/signals`);
//     return response.json();
//   } catch (err) {
//     console.error(err);
//     throw new Error('Unable to read Signal(s)', `signalId=${signalId}`);
//   }
// }

// async function updateSignal(data) {
//   try {
//     const response = await fetch(`${apiHost}/signals/${data.signalId}`, {
//       method: 'PUT',
//       cache: 'no-cache',
//       crossDomain: true,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     });
//     return await response.json();
//   } catch (err) {
//     console.error(err)
//     throw new Error('Unable to update Signal', data);
//   }
// }

// async function readSensor(sensorId = null) {
//   try {
//     const response = sensorId !== null
//       ? await fetch(`${apiHost}/sensors/${sensorId}`)
//       : await fetch(`${apiHost}/sensors`);
//     return response.json();
//   } catch (err) {
//     console.error(err);
//     throw new Error('Unable to read Sensors(s)', `sensorId=${sensorId}`);
//   }
// }

