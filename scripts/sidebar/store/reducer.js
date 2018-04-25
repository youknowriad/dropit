import { combineReducers } from "@wordpress/data";

export function services(state = {}, action) {
  if (action.type === "INIT_SERVICES") {
    return action.services;
  }

  return state;
}

export default combineReducers({ services });
