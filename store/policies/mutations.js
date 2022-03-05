import POLICIES from '~/constants/policies/private.js';
const mutations = {
  [POLICIES.mutations.SET_ITEMS](state, policies) {
    state.items = policies;
  },
};

export default mutations;
