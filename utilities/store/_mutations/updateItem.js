/**
 * Updates the item in the store.
 * @param {String} key The key of the store property.
 * @param {String} format A string with the desired date format.
 */
export default {
  name: 'UPDATE_ITEM',
  execute: function MUTATION_UPDATE_ITEM(key, format = 'ddd, MMM D, YYYY') {
    return function (state, item) {
      console.log('mutation', item);

      if (item.created_at) {
        item.created_at = this.$dayjs(item.created_at).format(format);
      }
      if (item.updated_at) {
        item.updated_at = this.$dayjs(item.updated_at).format(format);
      }
      const record = state[key].find(({ id }) => id === item.id);
      if (record) {
        console.log('record', record);
        Object.assign(record, item);
      }
    };
  },
};
