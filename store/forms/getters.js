import FORMS from '~/constants/forms/private.js';
import { mapGettersToStore } from '~/utilities/store';

const getters = {
  ...mapGettersToStore(FORMS),
};

export default getters;
