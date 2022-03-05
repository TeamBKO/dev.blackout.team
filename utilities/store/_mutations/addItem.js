export default {
  name: 'ADD_ITEM',
  execute: function MUTATION_ADD_ITEM(key, format = 'ddd, MMM D, YYYY') {
    return function (state, item) {
      if (item.created_at) {
        item.created_at = this.$dayjs(item.created_at).format(format);
      }
      if (item.updated_at) {
        item.updated_at = this.$dayjs(item.updated_at).format(format);
      }

      const idx = state[key].findIndex(({ id }) => id === item.id);
      if (idx !== -1) {
        state[key].splice(idx, 1, item);
      } else {
        state[key].unshift(item);
      }
    };
  },
};
