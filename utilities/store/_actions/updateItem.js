import replaceStr from '~/utilities/replaceStr';

export const UPDATE_ITEM = function (namespace, options) {
  return async function ({ commit }, { id, payload }) {
    if (typeof options.url === undefined) {
      throw new Error(
        "REMOVE ITEMS must contain an options object with a property of 'url'"
      );
    }

    let method = options.method ? options.method : 'patch';

    try {
      const item = (
        await this.$axios[method](options.url.concat(`/${id}`), payload)
      ).data;

      let success = 'Saved changes.';

      if (item) {
        commit(namespace.mutations.UPDATE_ITEM, item);
        if (options.successMessage) {
          success = replaceStr(options.successMessage, item);
        }
      }

      this.$toast.success(success, {
        position: 'top-center',
        duration: options.messageDuration || 2000,
      });

      return item ? Promise.resolve(item) : Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export default {
  name: 'UPDATE_ITEM',
  execute: UPDATE_ITEM,
};
