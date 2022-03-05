export default {
  name: 'EXCLUDE_FROM_FETCH',
  execute: function MUTATION_ADD_TO_EXCLUDE() {
    return function (state, id) {
      state.queryParams.exclude.push(id);
    };
  },
};
