const Reducer=(state, action)=>{
  switch(action.type) {
    case 'UPDATE_LOCO':
      const locos = state.locos.map(loco => 
        loco.address === action.payload.address
          ? { ...loco, ...action.payload }
          : loco
      );
      return {
        ...state,
        locos
      };
    default:
      return state;    
  }
}

export default Reducer;
