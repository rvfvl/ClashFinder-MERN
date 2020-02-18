import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from 'actions/types';
import { setAlert } from 'actions/alertActions';
import setAuthToken from 'utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const response = await axios.get('http://localhost:5000/api/v1/auth');

    dispatch({ type: USER_LOADED, payload: response.data });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const registerUser = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const response = await axios.post('http://localhost:5000/api/v1/auth/register', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const loginUser = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const response = await axios.post('http://localhost:5000/api/v1/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logoutUser = dispatch => {
  dispatch({
    type: LOGOUT
  });
};
