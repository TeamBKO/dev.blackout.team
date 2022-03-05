import types from '~/constants/menu/private.js';

const actions = {
  [types.mutations.FETCH]({ commit }) {},
  [types.mutations.ADD_MENU_LINK]({ commit }) {},
  [types.mutations.EDIT_MENU_LINK]({ commit }) {},
  [types.mutations.REMOVE_MENU_LINK]({ commit }) {},
};

export default actions;
