import ROSTERFORMS from '~/constants/rosters/forms/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = mapMutationsToStore(ROSTERFORMS, 'items', [
  'SET_ITEMS',
  'SET_SELECTED',
  'SET_HAS_MORE',
  'SET_LOADING',
  'SET_PARAM',
  'REMOVE_FROM_EXCLUDE',
  'EXCLUDE_FROM_FETCH',
  'REMOVE_ITEMS',
  'CLEAR_ITEMS',
]);

export default mutations;
