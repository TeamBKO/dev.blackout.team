import FORMS from '~/constants/forms/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(FORMS),
  // [types.mutations.SET_PARAM](state, { param, value }) {
  //   state.queryParams[param] = value;
  // },

  // [types.mutations.UPDATE_FORM_STATUS](state, { id, category_id, status }) {
  //   state.forms.forEach((form) => {
  //     if (form.category_id === category_id) {
  //       if (form.id !== id) form.status = false;
  //       else form.status = status;
  //     }
  //   });
  // },

  // [types.mutations.UPDATE_FORM_STATUS_DIRECTLY](state, { id, status }) {
  //   const form = state.forms.find((form) => form.id === id);
  //   if (form) form.status = status;
  // },

  // [types.mutations.SET_ITEMS](state, forms) {
  //   state.forms.push(...forms);
  // },

  // [types.mutations.ADD_ITEM]: addItem(),

  // [types.mutations.REMOVE_ITEMS]: removeItems(),

  // [types.mutations.SET_SELECTED](state, selected) {
  //   state.selected = selected;
  // },

  // [types.mutations.SET_NAME_IN_LIST](state, { id, name }) {
  //   const form = state.forms.find((f) => f.id === id);
  //   if (form) form.name = name;
  // },

  // [types.mutations.SET_CATEGORY_IN_LIST](state, { id, category_id, name }) {
  //   const form = state.forms.find((f) => f.id === id);
  //   if (form && form.category) {
  //     form.category.name = name;
  //     form.category.id = category_id;
  //   }
  // },

  // [types.mutations.UPDATE_FORM](state, form) {
  //   const idx = state.forms.findIndex(({ id }) => id === form.id);
  //   if (idx !== -1) state.forms.splice(idx, 1, form);
  // },

  [FORMS.mutations.CLEAR_ITEMS](state) {
    state.forms = [];
  },
};

export default mutations;
