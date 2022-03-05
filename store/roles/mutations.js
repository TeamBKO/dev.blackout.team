import ROLES from '~/constants/roles/private.js';
import MUTATION_ADD_ITEM from '~/utilities/store/mutations/addItem.js';
import MUTATION_REMOVE_ITEMS from '~/utilities/store/mutations/removeItems.js';
import MUTATION_SET_ITEMS from '~/utilities/store/mutations/setItems.js';
import MUTATION_EXCLUDE from '~/utilities/store/mutations/excludeFromFetch';
import MUTATION_REMOVE_FROM_EXCLUDE from '~/utilities/store/mutations/removeFromExclude.js';
import MUTATION_SET_PARAM from '~/utilities/store/mutations/setParam';
import MUTATION_UPDATE_ITEM from '~/utilities/store/mutations/updateItem';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(ROLES),
};

export default mutations;
