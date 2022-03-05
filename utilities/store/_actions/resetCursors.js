export const resetCursors = function (namespace) {
  return function ({ commit }) {
    commit(namespace.mutations.SET_PARAM, { param: 'nextCursor', value: '' });
    commit(namespace.mutations.SET_PARAM, { param: 'prevCursor', value: '' });
    commit(namespace.mutations.SET_PARAM, { param: 'exclude', value: [] });
    commit(namespace.mutations.SET_HAS_MORE, true);
    commit(namespace.mutations.SET_SELECTED, []);
    commit(namespace.mutations.CLEAR_ITEMS);
  };
};

export default {
  name: 'RESET_CURSORS',
  execute: resetCursors,
};
