import isUndefined from 'lodash/isUndefined';
export const CLEAR_ITEMS = function (namespace, options) {
  return function ({ state, commit }, data) {
    if (options && isUndefined(options.defaultParams)) {
      throw new ReferenceError(
        "CLEAR ITEMS must contain an options object with a property of 'defaultParams'"
      );
    }

    if (options.params && !Array.isArray(options.params)) {
      options.params = [options.params];
    } else {
      options.params = [];
    }

    const _params = ['nextCursor', 'prevCursor', 'exclude', ...options.params];
    if ((data && data.clear) || options.clear) {
      commit(namespace.mutations.CLEAR_ITEMS);
    }

    if (!isUndefined(state.selected) && state.selected.length) {
      commit(namespace.mutations.SET_SELECTED, []);
    }

    if (!isUndefined(state.hasMore) && !state.hasMore) {
      commit(namespace.mutations.SET_HAS_MORE, true);
    }

    _params.forEach((param) => {
      const value = options.defaultParams[param];
      commit(namespace.mutations.SET_PARAM, { param, value });
    });
  };
};

export default {
  name: 'CLEAR_ITEMS',
  execute: CLEAR_ITEMS,
};
