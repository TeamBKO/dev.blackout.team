export default {
  name: 'REMOVE_FROM_EXCLUDE',
  execute: function MUTATION_REMOVE_FROM_EXCLUDE() {
    return function (state, itemsToRemove) {
      if (!Array.isArray(itemsToRemove)) {
        itemsToRemove = [itemsToRemove];
      }

      state.queryParams.exclude = state.queryParams.exclude.filter(
        (id) => !itemsToRemove.includes(id)
      );
    };
  },
};
