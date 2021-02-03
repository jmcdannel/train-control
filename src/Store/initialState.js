import { apiStates } from '../Api';

export const initialState = {
  layout: null,
  locos: [],
  turnouts: [],
  signals: [],
  sensors: [],
  effects: [],
  menu: {
    view: 'pill',
    showMaps: true,
    group: '',
    lineFilters: [],
    sectionFilters: [],
    turnouts: {
      view: 'compact'
    }
  },
  userPreferences: {}
};

export default initialState;
