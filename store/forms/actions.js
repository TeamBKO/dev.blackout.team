import FORMS from '~/constants/forms/private.js';
import fetchItems from '~/utilities/store/actions/fetchItems.js';
import clearItems from '~/utilities/store/actions/clearItems.js';
import addItem from '~/utilities/store/actions/addItem.js';
import removeItems from '~/utilities/store/actions/removeItems.js';
import updateItem from '~/utilities/store/actions/updateItem.js';
import resetCursor from '~/utilities/resetCursor.js';
import pick from 'lodash/pick';

import { defaultQueryParams } from './state.js';
import { mapActionsToStore } from '~/utilities/store';

const actions = {
  ...mapActionsToStore(
    FORMS,
    {
      FETCH: {
        options: {
          url: '/admin/forms',
        },
      },
      ADD_ITEM: {
        options: {
          url: '/admin/forms',
          successMessage: 'Created new form: %name%',
        },
      },
      UPDATE_ITEM: {
        options: {
          url: '/admin/forms',
          successMessage: 'Updated form: %name%',
        },
      },
      REMOVE_ITEMS: {
        options: {
          url: '/admin/forms',
        },
      },
    },
    ['FETCH', 'ADD_ITEM', 'UPDATE_ITEM', 'RESET_FILTERS', 'REMOVE_ITEMS']
  ),
  // async [types.actions.FETCH](
  //   { commit, getters, state },
  //   { loader, isInitial, categories }
  // ) {
  //   const params = {
  //     ...pick(state.queryParams, ['nextCursor', 'prevCursor']),
  //     isInitial,
  //     categories,
  //   };

  //   if (state.queryParams.exclude.length) {
  //     Object.assign(params, { exclude: state.queryParams.exclude });
  //   }

  //   if (state.queryParams.searchByName) {
  //     Object.assign(params, { searchByName: state.queryParams.searchByName });
  //   }

  //   if (state.queryParams.status.length) {
  //     Object.assign(params, { status: state.queryParams.status });
  //   }

  //   try {
  //     const resp = await fetchItems.apply(this, [
  //       '/admin/forms',
  //       'forms',
  //       types,
  //       loader,
  //       commit,
  //       params,
  //     ]);
  //     this.$toast.show('Content loaded.', { position: 'bottom-center' });
  //     return isInitial ? resp.categories : null;
  //   } catch (err) {
  //     const text = err.response.data.message;
  //     this.$toast.error(text, { position: 'top-center' });
  //   }
  // },

  [FORMS.actions.RESET_CURSOR]: resetCursor(FORMS),

  // [types.actions.RESET_FILTERS](state, filters) {
  //   clearItems(types, defaultQueryParams, filters);
  // },

  // async [types.actions.CHANGE_FORM_DETAIL]({ commit }, { id, type, value }) {
  //   const details = { [type]: value };
  //   try {
  //     const { form } = (
  //       await this.$axios.patch(`/admin/forms/${id}`, { details })
  //     ).data;

  //     console.log(form);

  //     commit(types.mutations.UPDATE_FORM, form);
  //   } catch (err) {}
  // },

  // [types.actions.ADD_ITEM]: addItem(
  //   types,
  //   '/admin/forms',
  //   'Added new form: %name%'
  // ),

  // async [types.actions.ADD_ITEM]({ commit, getters, state }, payload) {

  //   try {
  //     const form = (await this.$axios.post('/admin/forms', params)).data;

  //     commit(types.mutations.SET_ITEMS, form);
  //     commit(types.mutations.EXCLUDE_FROM_FETCH, form.id);

  //     this.$toast.success(`Form: ${form.name} has been created.`, {
  //       position: 'top-center',
  //       duration: 3000,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     this.$toast.error(err.message, {
  //       position: 'top-center',
  //       duration: 3000,
  //     });
  //   }
  // },

  // [types.actions.REMOVE_ITEM]: removeItems(types, '/admin/forms'),

  // async [types.actions.REMOVE_ITEMS]({ state, getters, commit }, id) {
  //   const ids = id ? [id] : getters[types.getters.SELECTED_IDS];
  //   const params = { ids };

  //   try {
  //     const forms = (await this.$axios.delete(`/admin/forms`, { params })).data;
  //     commit(types.mutations.REMOVE_ITEMS, forms);
  //     commit(types.mutations.REMOVE_FROM_EXCLUSION, forms);
  //     commit(types.mutations.SET_SELECTED, []);
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // async [types.actions.EDIT_FORM]({ commit }, { id, data }) {
  //   try {
  //     const {
  //       data: { form },
  //     } = await this.$axios.patch(`/admin/forms/${id}`, data);

  //     console.log(form);

  //     commit(types.mutations.UPDATE_FORM, form);
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // [types.actions.UPDATE_ITEM]: updateItem(
  //   types,
  //   '/admin/forms',
  //   'Updated form: %name%'
  // ),

  // [types.actions.CLEAR_ITEMS]: clearItems(
  //   types,
  //   defaultQueryParams,
  //   'searchByName'
  // ),
};

export default actions;
