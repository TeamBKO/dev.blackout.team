import types from '~/constants/page/private.js';

const mutations = {
  [types.mutations.SET_TITLE](state, title) {
    state.title = title;
  },
  [types.mutations.SET_MOBILE](state, mobile) {
    state.mobile = mobile;
  },
  [types.mutations.TOGGLE_ACPANEL](state, bool) {
    state.adminPanel = bool;
  },
  [types.mutations.TOGGLE_STATUS_DIALOG](state, bool) {
    state.statusDialog = bool;
  },
};

export default mutations;
