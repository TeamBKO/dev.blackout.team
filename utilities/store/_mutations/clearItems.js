export default {
  name: 'CLEAR_ITEMS',
  execute: function MUTATION_CLEAR_ITEMS() {
    return function (state) {
      state.items = [];
    };
  },
};
