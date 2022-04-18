import RANKS from '~/constants/rosters/ranks/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = mapMutationsToStore(RANKS, 'items', [
  'ADD_ITEM',
  'UPDATE_ITEM',
  'SET_ITEMS',
  'SET_HAS_MORE',
  'SET_LOADING',
  'SET_PARAM',
  'REMOVE_FROM_EXCLUDE',
  'EXCLUDE_FROM_FETCH',
  'REMOVE_ITEMS',
  'CLEAR_ITEMS',
]);

export default mutations;
