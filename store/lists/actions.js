import LISTS from '~/constants/lists/private.js';
import { FETCH as fetchItems } from '~/utilities/store/_actions/fetchItems.js';
import { ADD_ITEM as addItem } from '~/utilities/store/_actions/addItem.js';
import { REMOVE_ITEMS as removeItems } from '~/utilities/store/_actions/removeItems.js';
import { UPDATE_ITEM as updateItem } from '~/utilities/store/_actions/updateItem.js';

const actions = {
  async [LISTS.actions.FETCH](ctx, { type }) {
    ctx.commit(LISTS.mutations.SET_TYPE, type);
    return fetchItems(LISTS, { url: `/admin/${type}` }).call(this, ctx);
  },

  async [LISTS.actions.ADD_ITEM](ctx, payload) {
    const type = ctx.state.type;
    return addItem(LISTS, { url: `/admin/${type}` }).call(this, ctx);
    // try {
    //   const item = (await this.$axios.post(`/admin/${type}`, payload)).data;

    //   commit(LISTS.mutations.ADD_ITEM, item);
    //   commit(LISTS.mutations.EXCLUDE_FROM_FETCH, item.id);

    //   return item;
    // } catch (err) {
    //   console.log(err);
    //   return Promise.reject(err);
    // }
  },

  async [LISTS.actions.REMOVE_ITEMS](ctx /*{ commit, state, getters }*/, id) {
    return removeItems(LISTS, { url: `/admin/${ctx.state.type}` }).call(
      this,
      ctx
    );
    // const ids = id ? [id] : getters[LISTS.getters.SELECTED_IDS];
    // const params = { ...state.queryParams, ids };
    // try {
    //   const { data } = await this.$axios.delete(`/admin/${state.type}`, {
    //     params,
    //   });
    //   commit(LISTS.mutations.REMOVE_ITEMS, data[state.type]);
    //   commit(LISTS.mutations.REMOVE_FROM_EXCLUDE);
    //   commit(LISTS.mutations.SET_SELECTED, []);
    // } catch (err) {
    //   console.log(err);
    // }
  },

  async [LISTS.actions.UPDATE_ITEM](ctx, payload) {
    return updateItem(LISTS, { url: `/admin/${ctx.state.type}` }).call(
      this,
      ctx,
      payload
    );
    // try {
    //   const data = await this.$axios.patch(`/admin/${route}/${id}`, {
    //     details,
    //   }).data;
    //   commit(LISTS.mutations.UPDATE_ITEM, data);
    // } catch (err) {
    //   console.log(err);
    // }
  },

  [LISTS.actions.CLEAR_ITEMS]({ commit }) {
    commit(LISTS.mutations.RESET_PARAMS);
    commit(LISTS.mutations.SET_HAS_MORE, true);
    commit(LISTS.mutations.SET_SELECTED, []);
    commit(LISTS.mutations.CLEAR_ITEMS);
    commit(LISTS.mutations.SET_TYPE, '');
  },
};

export default actions;
