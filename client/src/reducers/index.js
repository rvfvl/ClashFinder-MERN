import { combineReducers } from 'redux';
import authReducer from 'reducers/authReducer';
import alertReducer from 'reducers/alertReducer';
import searchReducer from 'reducers/searchReducer';
import profileReducer from 'reducers/profileReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  alerts: alertReducer,
  search: searchReducer,
  profile: profileReducer
});

export default rootReducer;
