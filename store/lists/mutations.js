import LISTS from '~/constants/lists/private.js';
import { defaultQueryParams } from './state.js';

const mutations = {
  [LISTS.mutations.SET_ITEMS](state, items) {
    items = items.map((item) => {
      if (item.created_at) {
        item.created_at = this.$dayjs(item.created_at).format(
          'ddd, MMM D, YYYY'
        );
      }
      if (item.updated_at) {
        item.updated_at = this.$dayjs(item.updated_at).format(
          'ddd, MMM D, YYYY'
        );
      }
      return item;
    });
    state.items[state.type] = state.items[state.type].concat(items);
  },
  [LISTS.mutations.REMOVE_ITEMS](state, items) {
    const ids = items.map(({ id }) => id);
    state.items[state.type] = state.items[state.type].filter(
      ({ id }) => !ids.includes(id)
    );
  },

  // [LISTS.mutations.REMOVE_FROM_EXCLUDE]: MUTATION_REMOVE_FROM_EXCLUDE(),

  // [LISTS.mutations.EXCLUDE_FROM_FETCH]: MUTATION_ADD_TO_EXCLUDE(),

  [LISTS.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },
  [LISTS.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [LISTS.mutations.UPDATE_ITEM](state, item) {
    const items = state[state.type];
    const idx = items.findIndex(({ id }) => id === item.id);
    if (idx !== -1) items.splice(idx, 1, item);
  },
  [LISTS.mutations.RESET_PARAMS](state) {
    state.queryParams = defaultQueryParams;
  },
  [LISTS.mutations.SET_TYPE](state, type) {
    state.type = type;
  },
  [LISTS.mutations.CLEAR_ITEMS](state) {
    state.items[state.type] = [];
  },
};

export default mutations;
