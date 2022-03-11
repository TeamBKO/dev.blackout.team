import LISTS from '~/constants/lists/private.js';
import { mapGettersToStore } from '~/utilities/store';

const getters = {
  ...mapGettersToStore(LISTS),
  [LISTS.getters.GET_ITEMS]: (state) => (type) => state.items[type],
  // [types.getters.SELECTED]: (state) => state.selected,
  [LISTS.getters.TYPE]: (state) => state.type,
  // [types.getters.SELECTED_IDS]: (state) => state.selected.map(({ id }) => id),
  // [types.getters.QUERY_PARAMS]: (state) => (key) =>
  //   typeof key !== undefined ? state.queryParams[key] : state.queryParams,
};

export default getters;
