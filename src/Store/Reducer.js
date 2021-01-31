const Reducer=(state, action)=>{
  switch(action.type) {

    case 'INIT_STATE':
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
      return state;    
  }
}

export default Reducer;
