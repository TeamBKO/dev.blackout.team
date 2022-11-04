import LISTS from '~/constants/lists/private.js';
import { mapGettersToStore } from '~/utilities/store';

const getters = {
  ...mapGettersToStore(LISTS),
  [LISTS.getters.GET_ITEMS]: (state) => (type) => state.items[type],
  [LISTS.getters.TYPE]: (state) => state.type,
};

export default getters;
