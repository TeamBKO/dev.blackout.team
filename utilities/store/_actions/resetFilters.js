import { CLEAR_ITEMS as clearItems } from './clearItems.js';
export default {
  name: 'RESET_FILTERS',
  execute: function RESET_FILTERS(namespace, options) {
    if (options && typeof options.defaultParams === undefined) {
      throw new Error(
        "RESET_FILTERS must contain an options object with a property of 'defaultParams'"
      );
    }
    return function ({ state, commit }, filters) {
      clearItems(namespace, options.defaultParams, filters);
    };
  },
};
