import LISTS from '~/constants/lists/private.js';
import { FETCH as fetchItems } from '~/utilities/store/_actions/fetchItems.js';

const actions = {
  async [LISTS.actions.FETCH](ctx, { type }) {
    ctx.commit(LISTS.mutations.SET_TYPE, type);
    return fetchItems(LISTS, { url: `/admin/${type}` }).call(this, ctx);
  },

  async [LISTS.actions.ADD_ITEM]({ commit, state }, payload) {
    const type = state.type;
    try {
      const item = (await this.$axios.post(`/admin/${type}`, payload)).data;

      commit(LISTS.mutations.ADD_ITEM, item);
      commit(LISTS.mutations.EXCLUDE, item.id);

      return item;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },

  async [LISTS.actions.REMOVE_ITEMS]({ commit, state, getters }, id) {
    const ids = id ? [id] : getters[LISTS.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    try {
      const { data } = await this.$axios.delete(`/admin/${state.type}`, {
        params,
      });

      commit(LISTS.mutations.REMOVE_ITEMS, data[state.type]);
      commit(LISTS.mutations.REMOVE_FROM_EXCLUDE);
      commit(LISTS.mutations.SET_SELECTED, []);
    } catch (err) {
      console.log(err);
    }
  },

  async [LISTS.actions.UPDATE_ITEM]({ commit }, { id, route, details }) {
    try {
      const data = await this.$axios.patch(`/admin/${route}/${id}`, {
        details,
      }).data;

      commit(LISTS.mutations.UPDATE_ITEM, data);
    } catch (err) {
      console.log(err);
    }
  },

  [LISTS.actions.CLEAR_ITEMS]({ commit }) {
    commit(LISTS.mutations.RESET_PARAMS);
    commit(LISTS.mutations.SET_SELECTED, []);
    commit(LISTS.mutations.CLEAR_ITEMS);
    commit(LISTS.mutations.SET_TYPE, '');
  },
};

export default actions;
