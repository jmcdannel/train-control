const Reducer=(state, action)=>{
  switch(action.type) {

    case 'INIT_STATE':
      // console.log('INIT_STATE', {...state, ...action.payload}, state, action.payload);
      return {...state, ...action.payload};

    case 'UPDATE_LOCO':
      const locos = state.locos.map(loco => 
        loco.address == action.payload.address
          ? { ...loco, ...action.payload }
          : loco
      );
      console.log('UPDATE_LOCO', locos, action);
      return {
        ...state,
        locos
      };

    case 'UPDATE_TURNOUTS':
      return {
        ...state,
        turnouts: action.payload
      };

    case 'UPDATE_TURNOUT':
      const turnouts = state.turnouts.map(turnout => 
        turnout.turnoutId === action.payload.turnoutId
          ? { ...turnout, ...action.payload }
          : turnout
      );
      return {
        ...state,
        turnouts
      };

    case 'UPDATE_EFFECTS':
      return {
        ...state,
        effects: action.payload
      };

    case 'UPDATE_EFFECT':
      const effects = state.effects.map(effect => 
        effect.effectId === action.payload.effectId
          ? { ...effect, ...action.payload }
          : effect
      );
      return {
        ...state,
        effects
      };

    case 'UPDATE_SIGNALS':
      return {
        ...state,
        signals: action.payload
      };

    case 'UPDATE_SENSORS':
      return {
        ...state,
        sensors: action.payload
      };

    default:
      console.warn('REDUCER NOT FOUND: ', action);
      return state;    
  }
}

export default Reducer;
