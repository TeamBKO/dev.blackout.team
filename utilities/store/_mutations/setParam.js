/**
 * Sets the query parameter for the store.
 */
export default {
  name: 'SET_PARAM',
  execute: function MUTATION_SET_PARAM() {
    return function (state, { param, value }) {
      if (typeof state.queryParams[param] !== undefined) {
        state.queryParams[param] = value;
      }
    };
  },
};
