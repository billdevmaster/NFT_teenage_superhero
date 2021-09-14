import {combineReducers} from 'redux';
const initialState = {
  web3: null,
  chainId: 4,
  userAccount: null,
  bnbBalance: 0,
};
function web3(state = initialState, action) {
  switch (action.type) {
    case 'SET_WEB3_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_CHAIN_ID':
      return {
        ...state,
        chainId: action.payload,
      };
    case 'UPDATE_USER_ADDRESS':
      return {
        ...state,
        userAccount: action.payload,
      };
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  web3,
});

export default rootReducer;
