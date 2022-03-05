import USERS from '~/constants/users/private.js';

import { defaultQueryParams } from './state.js';

import { mapActionsToStore } from '~/utilities/store/index.js';

const actions = {
  ...mapActionsToStore(USERS, {
    FETCH: {
      options: {
        url: '/admin/users',
        queryParams: ['searchByUsername'],
      },
    },
    ADD_ITEM: {
      options: {
        url: '/admin/users',
        successMessage: 'Created new user: %name%',
      },
    },
    UPDATE_ITEM: {
      options: {
        url: '/admin/users',
        successMessage: 'Updated user: %name%',
      },
    },
    REMOVE_ITEMS: {
      options: {
        url: '/admin/users',
      },
    },
    CLEAR_ITEMS: {
      options: {
        defaultParams: defaultQueryParams,
        params: ['searchByUsername'],
      },
    },
    RESET_FILTERS: {
      options: {
        defaultParams: defaultQueryParams,
      },
    },
  }),
  async [USERS.actions.ADD_ROLE]({ commit, dispatch }, { userId, roleId }) {
    try {
      const user = (
        await this.$axios.patch(`/admin/users/${userId}/role`, {
          roleId,
        })
      ).data;

      commit(USERS.mutations.ADD_ROLE, user);
    } catch (err) {
      this.$toast.error(err.message, { position: 'top-center' });
    }
  },
  async [USERS.actions.REMOVE_ROLE]({ commit }, { userId, roleId }) {
    try {
      const user = (
        await this.$axios.delete(`/admin/users/${userId}/role`, {
          params: { roleId },
        })
      ).data;

      console.log(user);

      commit(USERS.mutations.REMOVE_ROLE, user);
    } catch (err) {}
  },
};

console.log(actions);

export default actions;
