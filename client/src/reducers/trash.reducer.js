export const SET_GARAGE_POSITION = 'SET_GARAGE_POSITION';
export const SET_CONTAINERS_INFO = 'SET_CONTAINERS_INFO';

export const trashReducer = (state, action) => {
  switch (action.type) {
    case SET_GARAGE_POSITION:
      return { ...state, garagePosition: action.payload };
    case SET_CONTAINERS_INFO:
      return { ...state, containersInfo: action.payload };
    default:
      return state;
  }
};
