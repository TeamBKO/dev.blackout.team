import ROSTERS from '~/constants/rosters/private.js';
import { mapGettersToStore } from '~/utilities/store';

const getters = {
  ...mapGettersToStore(ROSTERS),
  // [ROSTERS.getters.ITEMS]: (state) => state.items,
  // [ROSTERS.getters.SELECTED]: (state) => state.selected,
  // [ROSTERS.getters.SELECTED_IDS]: (state, getters) =>
  //   getters.selected.map(({ id }) => id),
  // [ROSTERS.getters.QUERY_PARAMS]: (state) => (key) =>
  //   typeof key !== undefined ? state.queryParams[key] : state.queryParams,
};

export default getters;
