const Reducer=(state, action)=>{
  switch(action.type) {

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layout: action.payload
      };

    case 'UPDATE_LAYOUT_STATUS':
      return {
        ...state,
        layoutStatus: action.payload
      };

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

    default:
      return state;    
  }
}

export default Reducer;
