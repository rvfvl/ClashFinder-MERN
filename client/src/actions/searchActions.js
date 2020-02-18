import { ADD_SEARCH_CRITERIA } from 'actions/types';

export const addSearchCriteria = criteria => {
  return {
    type: ADD_SEARCH_CRITERIA,
    payload: { ...criteria }
  };
};
