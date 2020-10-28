import { apiStates } from '../Api';

const locos = [
  {
    address: 31,
    name: "BNSF5931",
    road: "BNSF",
    isAcquired: false,
    speed: 0,
    forward: null,
    idleByDefault: true
  },
  {
    address: 3,
    name: "GN-317",
    road: "Great Northern",
    isAcquired: false,
    speed: 0,
    forward: null,
    idleByDefault: true
  }
];

export const initialState = {
  layout: null,
  layoutStatus: apiStates.idle,
  locos,
  turnouts: [],
  signals: [],
  sounds: null,
  menu: {
    turnouts: {
      view: 'compact'
    }
  },
  userPreferences: {}
};

export default initialState;
