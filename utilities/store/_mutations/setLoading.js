export default {
  name: 'SET_LOADING',
  execute: function MUTATION_SET_LOADING() {
    return function (state, loading) {
      state.loading = loading;
    };
  },
};
