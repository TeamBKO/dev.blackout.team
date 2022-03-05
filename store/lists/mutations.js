import types from '~/constants/lists/private.js';
import MUTATION_ADD_TO_EXCLUDE from '~/utilities/store/mutations/excludeFromFetch.js';
import MUTATION_REMOVE_FROM_EXCLUDE from '~/utilities/store/mutations/removeFromExclude.js';
import { defaultQueryParams } from './state.js';

const mutations = {
  [types.mutations.SET_ITEMS](state, items) {
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
  [types.mutations.REMOVE_ITEMS](state, items) {
    const ids = items.map(({ id }) => id);
    state.items[state.type] = state.items[state.type].filter(
      ({ id }) => !ids.includes(id)
    );
  },

  [types.mutations.REMOVE_FROM_EXCLUDE]: MUTATION_REMOVE_FROM_EXCLUDE(),

  [types.mutations.EXCLUDE]: MUTATION_ADD_TO_EXCLUDE(),

  [types.mutations.SET_SELECTED](state, value) {
    state.selected = value;
  },
  [types.mutations.SET_PARAM](state, { param, value }) {
    state.queryParams[param] = value;
  },
  [types.mutations.UPDATE_ITEM](state, item) {
    const items = state[state.type];
    const idx = items.findIndex(({ id }) => id === item.id);
    if (idx !== -1) items.splice(idx, 1, item);
  },
  [types.mutations.RESET_PARAMS](state) {
    state.queryParams = defaultQueryParams;
  },
  [types.mutations.SET_TYPE](state, type) {
    state.type = type;
  },
  [types.mutations.CLEAR_ITEMS](state) {
    state.items[state.type] = [];
  },
};

export default mutations;
