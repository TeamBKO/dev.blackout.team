export default {
  name: 'SET_SELECTED',
  execute: function MUTATION_SET_SELECTED() {
    return function (state, selected) {
      state.selected = selected;
    };
  },
};
