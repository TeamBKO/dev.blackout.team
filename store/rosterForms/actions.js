import ROSTERFORMS from '~/constants/rosters/forms/private.js';
import { mapActionsToStore } from '~/utilities/store';
import { defaultQueryParams } from './state.js';

const actions = mapActionsToStore(
  ROSTERFORMS,
  {
    FETCH: {
      options: {
        url: '/admin/rosters/forms',
      },
    },
    REMOVE_ITEMS: {
      options: {
        url: '/admin/rosters/forms',
      },
    },
    CLEAR_ITEMS: {
      options: {
        defaultParams: defaultQueryParams,
        clear: true,
      },
    },
  },
  ['FETCH', 'REMOVE_ITEMS', 'CLEAR_ITEMS']
);

export default actions;
