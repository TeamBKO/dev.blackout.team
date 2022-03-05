export const clearItems = function CLEAR_ITEMS(namespace, options) {
  return function ({ commit }, data) {
    if (options && typeof options.defaultParams === undefined) {
      throw new Error(
        "CLEAR ITEMS must contain an options object with a property of 'defaultParams'"
      );
    }

    if (options.params && !Array.isArray(options.params)) {
      options.params = [options.params];
    }

    const _params = ['nextCursor', 'prevCursor', 'exclude', ...options.params];
    if ((data && data.clear) || options.clear) {
      commit(namespace.mutations.CLEAR_ITEMS);
    }
    commit(namespace.mutations.SET_SELECTED, []);
    _params.forEach((param) => {
      const value = options.defaultParams[param];
      commit(namespace.mutations.SET_PARAM, { param, value });
    });
  };
};

export default {
  name: 'CLEAR_ITEMS',
  execute: clearItems,
};
