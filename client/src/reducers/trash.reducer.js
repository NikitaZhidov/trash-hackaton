export const SET_GARAGE_POSITION = 'SET_GARAGE_POSITION';
export const SET_CONTAINERS_INFO = 'SET_CONTAINERS_INFO';
export const SWITCH_SHOW_ONLY_FILLED = 'SWITCH_SHOW_ONLY_FILLED';

export const trashReducer = (state, action) => {
  switch (action.type) {
    case SET_GARAGE_POSITION:
      return { ...state, garagePosition: action.payload };
    case SET_CONTAINERS_INFO:
      return { ...state, containersInfo: action.payload };
    case SWITCH_SHOW_ONLY_FILLED:
      return { ...state, showOnlyFilled: !state.showOnlyFilled };
    default:
      return state;
  }
};
