import DISCORD_MESSAGE_DRAFTS from '~/constants/discordMessageDrafts/private.js';
import { mapGettersToStore } from '~/utilities/store';
const getters = {
  ...mapGettersToStore(DISCORD_MESSAGE_DRAFTS),
};

export default getters;
