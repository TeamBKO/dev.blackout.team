import ROLES from '~/constants/roles/private.js';

import { defaultQueryParams } from './state.js';
import { mapActionsToStore } from '~/utilities/store';

const actions = {
  ...mapActionsToStore(
    ROLES,
    {
      FETCH: {
        options: {
          url: '/admin/roles',
        },
      },
      ADD_ITEM: {
        options: {
          url: '/admin/roles',
          successMessage: 'Created role: %name%',
        },
      },
      UPDATE_ITEM: {
        options: {
          url: '/admin/roles',
          successMessage: 'Updated role: %name%',
        },
      },
      REMOVE_ITEMS: {
        options: {
          url: '/admin/roles',
        },
      },
      RESET_FILTERS: {
        options: {
          defaultParams: defaultQueryParams,
        },
      },
    },
    [
      'FETCH',
      'ADD_ITEM',
      'UPDATE_ITEM',
      'REMOVE_ITEMS',
      'RESET_FILTERS',
      'RESET_CURSORS',
      'CLEAR_ITEMS',
    ]
  ),
};

export default actions;
