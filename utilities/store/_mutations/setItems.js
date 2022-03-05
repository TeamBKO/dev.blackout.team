export default {
  name: 'SET_ITEMS',
  execute: function MUTATION_SET_ITEMS(
    key = 'items',
    format = 'ddd, MMM D, YYYY'
  ) {
    return function (state, items) {
      const newItems = items.map((item) => {
        if (item.created_at && format) {
          item.created_at = this.$dayjs(item.created_at).format(format);
        }
        if (item.updated_at && format) {
          item.updated_at = this.$dayjs(item.updated_at).format(format);
        }
        return item;
      });

      // state[key] = state[key].concat(items);
      state[key] = state[key].concat(newItems);
    };
  },
};
