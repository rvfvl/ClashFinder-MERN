import { SET_ALERT, REMOVE_ALERT } from 'actions/types';
import uuid from 'uuid';

export const setAlert = (type, msg) => dispatch => {
  const id = uuid.v4();

  dispatch({
    type: SET_ALERT,
    payload: { type, msg, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000);
};
