import types from '~/constants/menu/private.js';

const getters = {
  [types.getters.LINKS]: (state) => state.links,
};

export default getters;
