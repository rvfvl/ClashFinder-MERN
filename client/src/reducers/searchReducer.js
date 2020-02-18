import { ADD_SEARCH_CRITERIA } from 'actions/types';

const initialState = {
  minRank: 1,
  maxRank: 6,
  roles: ['ADC', 'SUPP', 'TOP', 'MID', 'JNG'],
  region: null,
  nationality: null
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SEARCH_CRITERIA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default searchReducer;
