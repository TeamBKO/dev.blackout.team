import replaceStr from '~/utilities/replaceStr.js';
import isUndefined from 'lodash/isUndefined';
/**
 * Sends the payload to the backend creating a new record
 * Gets back an id of the created item in response to be used to exclude from fetches to prevent duplicated results.
 * @param {Object} namespace The namespaces for the store.
 * @param {String} url The url of the endpoint.
 * @param {String} successMessage Optional. Overrides default success message.
 * @param {String} errorMessage Optional. Overrides default error message.
 * @param {Number} messageDuration The amount of time to display the toast in milliseconds.
 */

export const ADD_ITEM = function (namespace, options) {
  return async function ({ commit }, payload) {
    if (options && typeof options.url === undefined) {
      throw new Error(
        "REMOVE ITEMS must contain an options object with a property of 'url'"
      );
    }

    let method = !isUndefined(options.method) ? options.method : 'post';

    try {
      const item = (await this.$axios[method](options.url, payload)).data;

      commit(namespace.mutations.ADD_ITEM, item);
      commit(namespace.mutations.EXCLUDE_FROM_FETCH, item.id);

      let success = 'Saved changes.';

      if (options.successMessage) {
        success = replaceStr(options.successMessage, item);
      }

      this.$toast.show(success, {
        icon: 'check',
        position: 'top-center',
        duration: options.messageDuration || 2000,
      });
    } catch (err) {
      console.error(err);
      const text = 'Encountered a problem. Please contact the administrator.';
      this.$toast.error(text, { position: 'top-center' });
      return Promise.reject(err);
    }
  };
};

export default {
  name: 'ADD_ITEM',
  execute: ADD_ITEM,
};
