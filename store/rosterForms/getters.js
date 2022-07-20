import ROSTERFORMS from '~/constants/rosters/forms/private.js';
import { mapGettersToStore } from '~/utilities/store/';

// const getters = {
//   [ROSTERFORMS.getters.ITEMS]: (state) => state.items,
//   [ROSTERFORMS.getters.QUERY_PARAMS]: (state) => (key) =>
//     typeof key !== undefined ? state.queryParams[key] : state.queryParams,
//   [ROSTERFORMS.getters.HAS_MORE]: (state) => state.hasMore,
//   [ROSTERFORMS.getters.LOADING]: (state) => state.loading,
// };

const getters = mapGettersToStore(ROSTERFORMS);

export default getters;
