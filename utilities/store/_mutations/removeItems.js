export default {
  name: 'REMOVE_ITEMS',
  execute: function MUTATION_REMOVE_ITEMS(key) {
    return function (state, items) {
      const ids = items.map(({ id }) => id);
      state[key] = state[key].filter(({ id }) => !ids.includes(id));
    };
  },
};
