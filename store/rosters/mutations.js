import ROSTERS from '~/constants/rosters/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(ROSTERS),

  [ROSTERS.mutations.SET_SELECTED](state, selected) {
    state.selected = selected;
  },
  [ROSTERS.mutations.SET_HAS_MORE](state, hasMore) {
    state.hasMore = hasMore;
  },
  [ROSTERS.mutations.CLEAR_ITEMS](state) {
    state.rosters = [];
  },
};

export default mutations;
