import types from '~/constants/lists/private.js';

const getters = {
  [types.getters.GET_ITEMS]: (state) => (type) => state.items[type],
  [types.getters.SELECTED]: (state) => state.selected,
  [types.getters.TYPE]: (state) => state.type,
  [types.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),
  [types.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,
};

export default getters;
