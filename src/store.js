import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import dashboard from "./reducers/dashboard.reduser";
import * as api from "./utils/apiRequest";

const initialState = {
  sidebarShow: 'responsive'
}

const changeStateReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const rootReducers = combineReducers({
  // dashboard: dashboard,
  sidebar: changeStateReducer
});

const allEnhancers = compose(
  applyMiddleware(thunk)
);

const store = createStore(
  rootReducers,
  allEnhancers
);

export default store;