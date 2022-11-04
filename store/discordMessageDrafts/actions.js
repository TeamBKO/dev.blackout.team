import DISCORD_MESSAGE_DRAFTS from '~/constants/discordMessageDrafts/private.js';
import { mapActionsToStore } from '~/utilities/store';

const actions = mapActionsToStore(DISCORD_MESSAGE_DRAFTS, {
  FETCH: {
    options: {
      url: '/discord/drafts',
    },
  },
  ADD_ITEM: {
    options: {
      url: '/discord/drafts',
      successMessage: 'Saved draft: %name%',
    },
  },
  UPDATE_ITEM: {
    options: {
      url: '/discord/drafts',
      successMessage: 'Updated draft: %name%',
    },
  },
  REMOVE_ITEMS: {
    options: {
      url: '/discord/drafts',
      single: true,
      successMessage: 'Removed draft: %name%',
    },
  },
});

export default actions;
