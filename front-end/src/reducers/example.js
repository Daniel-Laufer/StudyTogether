/* eslint-disable default-param-last */
import { Example } from '../actions';

const initialState = {
  name: 'Daniel1',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Example.EXAMPLE_ACTION_CONSTANT:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};
