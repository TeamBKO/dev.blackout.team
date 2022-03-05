import POLICIES from '~/constants/policies/private.js';
import createPolicyList from '~/utilities/createPolicyList.js';

const getters = {
  [POLICIES.getters.ITEMS]: (state) => {
    return createPolicyList(state.items);
  },
};

export default getters;
