import RANKS from '~/constants/rosters/ranks/private.js';

const getters = {
  [RANKS.getters.ITEMS]: (state) => state.items,
  [RANKS.getters.QUERY_PARAMS]: (state) => (key) =>
    typeof key !== undefined ? state.queryParams[key] : state.queryParams,
  [RANKS.getters.HAS_MORE]: (state) => state.hasMore,
  [RANKS.getters.LOADING]: (state) => state.loading,
};

export default getters;
