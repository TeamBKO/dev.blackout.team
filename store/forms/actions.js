import FORMS from '~/constants/forms/private.js';

import { defaultQueryParams } from './state.js';
import { mapActionsToStore } from '~/utilities/store';

const actions = {
  ...mapActionsToStore(FORMS, {
    FETCH: {
      options: {
        url: '/admin/forms',
      },
    },
    ADD_ITEM: {
      options: {
        url: '/admin/forms',
        successMessage: 'Created new form: %name%',
      },
    },
    UPDATE_ITEM: {
      options: {
        url: '/admin/forms',
        successMessage: 'Updated form: %name%',
      },
    },
    REMOVE_ITEMS: {
      options: {
        url: '/admin/forms',
      },
    },
    CLEAR_ITEMS: {
      options: {
        defaultParams: defaultQueryParams,
        params: ['searchByName'],
      },
    },
  }),
};

export default actions;
