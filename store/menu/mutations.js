import types from '~/constants/menu/private.js';

const mutations = {
  [types.mutations.SET_LINKS](state, links) {},
  [types.mutations.ADD_LINK](state, link) {},
  [types.mutations.EDIT_LINK](state, { id, title, to }) {},
  [types.mutations.REMOVE_LINK](state, id) {},
};

export default mutations;
