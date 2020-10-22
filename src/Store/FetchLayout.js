import api, { apiStates } from '../Api';

export const fetchLayout = async (layoutId, dispatch) => {
  dispatch({ type: 'UPDATE_LAYOUT_STATUS', payload: apiStates.pending });
  try {
    const payload = await api.layouts.get(layoutId);
    console.log('fetchLayout', payload);
    await dispatch({ type: 'UPDATE_LAYOUT', payload });
    dispatch({ type: 'UPDATE_LAYOUT_STATUS', payload: apiStates.done });
  } catch(err) {
    console.error('fetchLayout', err);
    dispatch({ type: 'UPDATE_LAYOUT_STATUS', payload: apiStates.error });
  }
}

export default fetchLayout;
