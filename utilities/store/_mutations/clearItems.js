export default {
  name: 'CLEAR_ITEMS',
  execute: function MUTATION_CLEAR_ITEMS(key) {
    return function (state) {
      state[key] = [];
    };
  },
};
