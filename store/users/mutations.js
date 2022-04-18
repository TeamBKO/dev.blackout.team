import USERS from '~/constants/users/private.js';
import { mapMutationsToStore } from '~/utilities/store';

const mutations = {
  ...mapMutationsToStore(USERS),

  [USERS.mutations.ADD_ROLE](state, { user_id, role }) {
    const user = state.items.find((u) => u.id === user_id);
    if (user) user.roles.push(role);
  },

  [USERS.mutations.REMOVE_ROLE](state, { user_id, role_id }) {
    const user = state.items.find((u) => u.id === user_id);
    if (user) {
      const idx = user.roles.findIndex((role) => role.id === role_id);
      if (idx !== -1) user.roles.splice(idx, 1);
    }
  },
};

export default mutations;
