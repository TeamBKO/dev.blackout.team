export default function (obj) {
  return function ({ commit }) {
    commit(obj.mutations.SET_SELECTED, []);
    commit(obj.mutations.SET_PARAM, { param: 'nextCursor', value: '' });
    commit(obj.mutations.SET_PARAM, { param: 'prevCursor', value: '' });
    commit(obj.mutations.CLEAR_ITEMS);
  };
}
