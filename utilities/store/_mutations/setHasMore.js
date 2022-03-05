export default {
  name: 'SET_HAS_MORE',
  execute: function MUTATION_SET_HAS_MORE() {
    return function (state, hasMore) {
      state.hasMore = hasMore;
    };
  },
};
