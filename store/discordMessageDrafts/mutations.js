import DISCORD_MESSAGE_DRAFTS from '~/constants/discordMessageDrafts/private.js';

import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(DISCORD_MESSAGE_DRAFTS),
};

export default mutations;
