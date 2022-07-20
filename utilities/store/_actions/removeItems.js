import replaceStr from '~/utilities/replaceStr.js';

export const REMOVE_ITEMS = function (namespace, options) {
  return async function ({ commit, getters }, id) {
    if (options && typeof options.url === undefined) {
      throw new ReferenceError(
        "REMOVE ITEMS must contain an options object with a property of 'url'"
      );
    }
    const ids = id ? [id] : getters[namespace.getters.SELECTED_IDS];
    const params = { ids };

    try {
      const items = (await this.$axios.delete(options.url, { params })).data;

      commit(namespace.mutations.REMOVE_ITEMS, items);
      commit(namespace.mutations.REMOVE_FROM_EXCLUDE, items);
      commit(namespace.mutations.SET_SELECTED, []);

      let success = 'Removed item.';

      if (items?.length > 1) {
        success = `Removed items with the following ids: ${ids}`;
      } else {
        if (options.successMessage) {
          success = replaceStr(options.successMessage, items[0]);
        }
      }

      this.$toast.success(success, { position: 'top-center' });
    } catch (err) {
      console.error(err);

      this.$toast.error(err.response.data.message, {
        position: 'top-center',
        duration: 3000,
      });

      return Promise.reject(err);
    }
  };
};

export default {
  name: 'REMOVE_ITEMS',
  execute: REMOVE_ITEMS,
};
