import isObject from 'lodash/isObject';
/**
 * Sends a request to the api to retrieve items. Updates the store.
 * @param {Object} namespace The namespace of the store.
 * @param {Object} options The options for the function.
 */
export const FETCH = function (namespace, options) {
  return async function (
    { state, commit, dispatch },
    data = { loading: false }
  ) {
    const params = {};

    if (!state.hasMore) return;

    if (options.queryParams) {
      let queryParams = options.queryParams;
      if (!Array.isArray(queryParams)) {
        queryParams = [queryParams];
      }
      if (isObject(queryParams)) {
        queryParams = Object.values(queryParams);
      }
      if (queryParams.length) {
        Object.assign(
          params,
          queryParams.reduce((obj, param) => {
            if (typeof state.queryParams[param] !== undefined) {
              const queryParam = state.queryParams[param];

              if (Array.isArray(queryParam)) {
                if (queryParam.length) {
                  obj[param] = queryParam;
                }
              } else {
                if (queryParam || Number.isInteger(queryParam)) {
                  obj[param] = queryParam;
                }
              }
            }
            return obj;
          }, {})
        );
      }
    }

    if (state.queryParams.nextCursor) {
      Object.assign(params, { nextCursor: state.queryParams.nextCursor });
    }

    if (state.queryParams.prevCursor) {
      Object.assign(params, { prevCursor: state.queryParams.nextCursor });
    }

    if (state.queryParams.exclude.length) {
      Object.assign(params, { exclude: state.queryParams.exclude.length });
    }

    if (data && data.isInitial) {
      Object.assign(params, { isInitial: data.isInitial });
    }

    const url = data && data.url ? data.url : options.url;

    if (data && data.loading) {
      commit(namespace.mutations.SET_LOADING, true);
    }
    try {
      let items = await this.$axios.$get(url, { params });

      // let items;

      // if (options.key) {
      //   if (typeof response[key] !== undefined) {
      //     items = response[key];
      //   }
      // } else {
      //   items = response;
      // }

      if (items && items.results && items.results.length) {
        if (typeof items.pageInfo.hasMore !== undefined) {
          commit(namespace.mutations.SET_HAS_MORE, items.pageInfo.hasMore);
        }
        commit(namespace.mutations.SET_ITEMS, items.results);

        if (items.pageInfo.next) {
          commit(namespace.mutations.SET_PARAM, {
            param: 'nextCursor',
            value: items.pageInfo.next,
          });
        }
        if (items.pageInfo.next) {
          commit(namespace.mutations.SET_PARAM, {
            param: 'prevCursor',
            value: items.pageInfo.previous,
          });
        }
        // commit(namespace.mutations.SET_HAS_MORE, []);
      } else {
        commit(namespace.mutations.SET_HAS_MORE, false);
      }
      return items;
    } catch (err) {
      console.log(err);
      // this.$toast.error('Encountered an error.', {
      //   duration: null,
      //   action: [
      //     {
      //       text: 'Retry',
      //       onClick: (e, toastObject) => {
      //         toastObject.goAway(0);
      //         dispatch(namespace.actions.FETCH);
      //       },
      //     },
      //     {
      //       text: 'Close',
      //       onClick: (e, toastObject) => {
      //         toastObject.goAway(0);
      //       },
      //     },
      //   ],
      // });

      return Promise.reject(err);
    } finally {
      if (data && data.loading) {
        commit(namespace.mutations.SET_LOADING, false);
      }
    }
  };
};

export default {
  name: 'FETCH',
  execute: FETCH,
};
