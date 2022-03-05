export default {
  name: 'REMOVE_ITEMS',
  execute: function REMOVE_ITEMS(namespace, options) {
    return async function ({ commit, getters }, id) {
      if (options && typeof options.url === undefined) {
        throw new Error(
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
        const text = `Removed items with the following ids: ${ids}`;
        this.$toast.success(text, { position: 'top-center' });
      } catch (err) {
        console.error(err);

        this.$toast.error(err.response.data.message, {
          position: 'top-center',
          duration: 3000,
        });

        return Promise.reject(err);
      }
    };
  },
};
