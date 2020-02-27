import axios from 'axios';
import { setAlert } from 'actions/alertActions';
import {
  CURRENT_USER_PROFILE,
  CURRENT_USER_PROFILE_ERROR,
  SET_PROFILE_VISIBILITY,
  SET_PROFILE_VISIBILITY_ERROR,
  UNVERIFY_SUMMONER_PROFILE,
  UNVERIFY_SUMMONER_PROFILE_ERROR,
  VERIFY_SUMMONER_PROFILE,
  VERIFY_SUMMONER_PROFILE_ERROR,
  GET_PROFILE_LIST,
  GET_PROFILE_LIST_ERROR
} from 'actions/types';

export const getCurrentUserProfile = () => async dispatch => {
  try {
    const response = await axios.get('/api/v1/profile/me');

    dispatch({ type: CURRENT_USER_PROFILE, payload: response.data });
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));
    dispatch({ type: CURRENT_USER_PROFILE_ERROR });
  }
};

export const setProfileVisibilityAction = profileStatus => async dispatch => {
  const status = JSON.stringify({ profileVisibility: profileStatus });

  try {
    const response = await axios.put('/api/v1/profile/visibility', status, {
      headers: { 'Content-Type': 'application/json' }
    });

    dispatch({ type: SET_PROFILE_VISIBILITY, payload: response.data.profileVisibility });
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));
    dispatch({ type: SET_PROFILE_VISIBILITY_ERROR });
  }
};

export const unverifySummonerProfile = () => async dispatch => {
  try {
    const response = await axios.get('/api/v1/profile/unverify');
    console.log('response', response);

    dispatch(setAlert('success', response.data.msg));
    dispatch({ type: UNVERIFY_SUMMONER_PROFILE });
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));
    dispatch({ type: UNVERIFY_SUMMONER_PROFILE_ERROR });
  }
};

export const verifySummonerProfile = summonerData => async dispatch => {
  const summonerInfo = JSON.stringify(summonerData);
  console.log(summonerInfo);

  try {
    const response = await axios.post('/api/v1/profile/verify', summonerInfo, {
      headers: { 'Content-Type': 'application/json' }
    });

    dispatch({ type: VERIFY_SUMMONER_PROFILE, payload: response.data });
    dispatch(setAlert('success', 'Profile verified.'));
  } catch (error) {
    console.log(error.response);
    dispatch(setAlert('danger', error.response.data.errors.msg));
    dispatch({ type: VERIFY_SUMMONER_PROFILE_ERROR });
  }
};

export const getAllProfiles = params => async dispatch => {
  try {
    const response = await axios.get(`/api/v1/profile/${params}`);
    dispatch({ type: GET_PROFILE_LIST, payload: response.data });
  } catch (error) {
    dispatch(setAlert('danger', error.response.data.errors.msg));
    dispatch({ type: GET_PROFILE_LIST_ERROR });
  }
};
