import ROSTERS from '~/constants/rosters/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = mapMutationsToStore(ROSTERS);

export default mutations;
