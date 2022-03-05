import POLICIES from '~/constants/policies/private.js';

const actions = {
  async [POLICIES.actions.FETCH]({ commit }, loading) {
    try {
      const policies = await this.$axios.$get('/policies');
      commit(POLICIES.mutations.SET_ITEMS, policies);
    } catch (err) {}
  },
};

export default actions;
