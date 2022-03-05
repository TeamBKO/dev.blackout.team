import types from '~/constants/page/private.js';
const getters = {
  [types.getters.TITLE]: (state) => state.title,
  [types.getters.MOBILE]: (state) => state.mobile,
  [types.getters.ACPANEL]: (state) => state.adminPanel,
  [types.getters.STATUS_DIALOG]: (state) => state.statusDialog,
};

export default getters;
