import ROSTERS from '~/constants/rosters/private.js';
import { mapActionsToStore } from '~/utilities/store';
import { defaultQueryParams } from './state';

const generated = mapActionsToStore(ROSTERS, {
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
      url: '/admin/rosters',
      successMessage: 'Updated roster: %name%',
    },
  },
  REMOVE_ITEMS: {
    options: {
      url: '/admin/rosters',
    },
  },
  CLEAR_ITEMS: {
    options: {
      defaultParams: defaultQueryParams,
      params: ['searchByName'],
    },
  },
});

const actions = {
  ...generated,
  // async [ROSTERS.actions.FETCH]({ state, commit, dispatch }) {
  //   const params = {};

  //   if (state.queryParams.nextCursor) {
  //     Object.assign(params, { nextCursor: state.queryParams.nextCursor });
  //   }

  //   if (state.queryParams.searchByName) {
  //     Object.assign(params, { searchByName: state.queryParams.searchByName });
  //   }

  //   if (state.queryParams.exclude.length) {
  //     Object.assign(params, { exclude: state.queryParams.exclude.length });
  //   }

  //   try {
  //     const items = await this.$axios.$get('/admin/rosters', { params });

  //     if (items && items.results && items.results.length) {
  //       commit(ROSTERS.mutations.SET_ITEMS, items.results);
  //       if (items.pageInfo.hasOwnProperty('hasMore')) {
  //         commit(ROSTERS.mutations.SET_HAS_MORE, item.pageInfo.hasMore);
  //       }
  //       if (items.pageInfo.next) {
  //         commit(ROSTERS.mutation.SET_PARAM, {
  //           param: 'nextCursor',
  //           value: item.pageInfo.next,
  //         });
  //       }
  //       if (items.pageInfo.next) {
  //         commit(ROSTERS.mutation.SET_PARAM, {
  //           param: 'prevCursor',
  //           value: item.pageInfo.previous,
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     this.$toast.error('Encountered an error.', {
  //       duration: null,
  //       action: [
  //         {
  //           text: 'Retry',
  //           onClick: (e, toastObject) => {
  //             toastObject.goAway(0);
  //             dispatch(ROSTERS.actions.FETCH);
  //           },
  //         },
  //       ],
  //     });
  //   }
  // },
};

export default actions;
