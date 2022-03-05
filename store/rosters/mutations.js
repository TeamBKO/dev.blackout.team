import ROSTERS from '~/constants/rosters/private.js';
import MUTATION_ADD_ITEM from '~/utilities/store/mutations/addItem';
import MUTATION_ADD_TO_EXCLUDE from '~/utilities/store/mutations/excludeFromFetch';
import MUTATION_REMOVE_FROM_EXCLUDE from '~/utilities/store/mutations/removeFromExclude';
import MUTATION_REMOVE_ITEMS from '~/utilities/store/mutations/removeItems';
import MUTATION_SET_ITEMS from '~/utilities/store/mutations/setItems';
import MUTATION_SET_PARAM from '~/utilities/store/mutations/setParam';
import MUTATION_UPDATE_ITEM from '~/utilities/store/mutations/updateItem';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(ROSTERS),
  // [ROSTERS.mutations.SET_ITEMS]: MUTATION_SET_ITEMS('rosters'),
  // [ROSTERS.mutations.ADD_ITEM]: MUTATION_ADD_ITEM('rosters'),
  // [ROSTERS.mutations.UPDATE_ITEM]: MUTATION_UPDATE_ITEM('rosters'),
  // [ROSTERS.mutations.REMOVE_ITEMS]: MUTATION_REMOVE_ITEMS('rosters'),
  // [ROSTERS.mutations.SET_PARAM]: MUTATION_SET_PARAM(),
  // [ROSTERS.mutations.EXCLUDE]: MUTATION_ADD_TO_EXCLUDE(),
  // [ROSTERS.mutations.REMOVE_FROM_EXCLUDE]: MUTATION_REMOVE_FROM_EXCLUDE(),
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
