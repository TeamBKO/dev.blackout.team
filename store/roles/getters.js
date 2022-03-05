import ROLES from '~/constants/roles/private.js';
import { mapGettersToStore } from '~/utilities/store';
const getters = {
  ...mapGettersToStore(ROLES),
};

export default getters;
