import lists from '~/constants/lists/private.js';
import pick from 'lodash/pick';
import fetchItems from '~/utilities/store/actions/fetchItems.js';
import resetCursor from '~/utilities/resetCursor.js';

const actions = {
  async [lists.actions.FETCH]({ commit, state }, { type, loader, isInitial }) {
    commit(lists.mutations.SET_TYPE, type);

    const params = {
      isInitial,
      ...state.queryParams,
    };

    try {
      await fetchItems.call(
        this,
        `/admin/${state.type}`,
        null,
        lists,
        loader,
        commit,
        params
      );
    } catch (err) {
      const text = err.message;
      this.$toast.error(text, { position: 'top-center' });
    }
  },

  [lists.actions.RESET_CURSOR]: resetCursor(lists),

  async [lists.actions.ADD_ITEM]({ commit, state }, payload) {
    const type = state.type;
    try {
      const item = (await this.$axios.post(`/admin/${type}`, payload)).data;

      commit(lists.mutations.ADD_ITEM, item);
      commit(lists.mutations.EXCLUDE, item.id);

      return item;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },

  async [lists.actions.REMOVE_ITEMS]({ commit, state, getters }, id) {
    const ids = id ? [id] : getters[lists.getters.SELECTED_IDS];
    const params = { ...state.queryParams, ids };
    try {
      const { data } = await this.$axios.delete(`/admin/${state.type}`, {
        params,
      });

      commit(lists.mutations.REMOVE_ITEMS, data[state.type]);
      commit(lists.mutations.REMOVE_FROM_EXCLUDE);
      commit(lists.mutations.SET_SELECTED, []);
    } catch (err) {
      console.log(err);
    }
  },

  async [lists.actions.UPDATE_ITEM]({ commit }, { id, route, details }) {
    try {
      const data = await this.$axios.patch(`/admin/${route}/${id}`, {
        details,
      }).data;

      commit(lists.mutations.UPDATE_ITEM, data);
    } catch (err) {
      console.log(err);
    }
  },

  [lists.actions.CLEAR_ITEMS]({ commit }) {
    commit(lists.mutations.RESET_PARAMS);
    commit(lists.mutations.SET_SELECTED, []);
    commit(lists.mutations.CLEAR_ITEMS);
    commit(lists.mutations.SET_TYPE, '');
  },
};

export default actions;
