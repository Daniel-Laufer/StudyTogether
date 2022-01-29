/* eslint-disable default-param-last */
import { Example } from '../actions';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case Example.EXAMPLE_ACTION_CONSTANT:
      return {
        ...state,
        exampleFetching: true,
      };
    default:
      return state;
  }
};
