import ROSTERS from '~/constants/rosters/private.js';
import { mapActionsToStore } from '~/utilities/store';
import { defaultQueryParams } from './state';

const actions = mapActionsToStore(ROSTERS, {
  FETCH: {
    options: {
      url: '/admin/rosters',
      params: ['searchByName'],
    },
  },
  ADD_ITEM: {
    options: {
      url: '/admin/rosters',
      successMessage: 'Created new roster: %name%',
    },
  },
  UPDATE_ITEM: {
    options: {
      url: '/rosters',
      successMessage: 'Updated roster: %name%',
    },
  },
  REMOVE_ITEMS: {
    options: {
      url: '/admin/rosters',
      successMessage: 'Removed roster: %name%',
    },
  },
  CLEAR_ITEMS: {
    options: {
      defaultParams: defaultQueryParams,
      params: ['searchByName'],
    },
  },
});

export default actions;
