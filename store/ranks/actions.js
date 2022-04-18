import RANKS from '~/constants/rosters/ranks/private.js';
import { mapActionsToStore } from '~/utilities/store';
import { defaultQueryParams } from './state.js';

const actions = {
  ...mapActionsToStore(
    RANKS,
    {
      FETCH: {
        options: {
          url: '/rosters/%id%/ranks',
        },
      },
      ADD_ITEM: {
        options: {
          url: '/rosters/rank',
          successMessage: 'Added new rank: %name%',
          method: 'patch',
        },
      },
      UPDATE_ITEM: {
        options: {
          url: '/rosters/rank',
          successMessage: 'Updated rank: %name%',
        },
      },
      CLEAR_ITEMS: {
        options: {
          defaultParams: defaultQueryParams,
          clear: true,
        },
      },
    },
    ['FETCH', 'ADD_ITEM', 'UPDATE_ITEM', 'CLEAR_ITEMS']
  ),

  async [RANKS.actions.REMOVE_ITEM]({ commit }, id) {
    try {
      const item = await this.$axios.$delete(`/rosters/rank/${id}`);
      commit(RANKS.mutations.REMOVE_ITEMS, [item]);
      commit(RANKS.mutations.REMOVE_FROM_EXCLUDE, [item.id]);
      this.$toast.success(`Removed rank: ${item.name}`, {
        position: 'top-center',
      });

      return Promise.resolve(item);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },
};

export default actions;
