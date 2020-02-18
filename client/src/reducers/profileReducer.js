import {
  CURRENT_USER_PROFILE,
  CURRENT_USER_PROFILE_ERROR,
  SET_PROFILE_VISIBILITY_ERROR,
  SET_PROFILE_VISIBILITY,
  UNVERIFY_SUMMONER_PROFILE,
  UNVERIFY_SUMMONER_PROFILE_ERROR,
  VERIFY_SUMMONER_PROFILE,
  VERIFY_SUMMONER_PROFILE_ERROR,
  GET_PROFILE_LIST,
  GET_PROFILE_LIST_ERROR
} from 'actions/types';

const initialState = {
  currentProfile: null,
  profiles: [],
  loading: true
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_PROFILE:
      return { ...state, currentProfile: action.payload, loading: false };
    case CURRENT_USER_PROFILE_ERROR:
    case SET_PROFILE_VISIBILITY_ERROR:
    case UNVERIFY_SUMMONER_PROFILE_ERROR:
    case GET_PROFILE_LIST_ERROR:
      return { ...state, loading: false };
    case SET_PROFILE_VISIBILITY:
      return {
        ...state,
        currentProfile: { ...state.currentProfile, profileVisibility: action.payload },
        loading: false
      };
    case UNVERIFY_SUMMONER_PROFILE:
    case VERIFY_SUMMONER_PROFILE_ERROR:
      return {
        ...state,
        currentProfile: { ...state.currentProfile, summonerProfile: null },
        loading: false
      };
    case VERIFY_SUMMONER_PROFILE:
      return {
        ...state,
        currentProfile: { ...state.currentProfile, summonerProfile: action.payload },
        loading: false
      };
    case GET_PROFILE_LIST:
      return {
        ...state,
        profiles: action.payload.profiles.filter(profile => profile.summonerProfile !== null),
        loading: false
      };
    default:
      return state;
  }
};

export default profileReducer;
