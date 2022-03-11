import ROLES from '~/constants/roles/private.js';

import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(ROLES),
};

export default mutations;
