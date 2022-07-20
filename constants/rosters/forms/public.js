export default {
  getters: {
    ITEMS: 'rosterForms/items',
    QUERY_PARAMS: 'rosterForms/queryParams',
    SELECTED: 'rosterForms/selected',
    HAS_MORE: 'rosterForms/hasMore',
    LOADING: 'rosterForms/loading',
  },
  mutations: {
    SET_ITEMS: 'rosterForms/setItems',
    SET_SELECTED: 'rosterForms/setSelected',
    REMOVE_ITEMS: 'rosterForms/removeRoster',
    SET_PARAM: 'rosterForms/setParam',
    SET_HAS_MORE: 'rosterForms/setHasMore',
    EXCLUDE_FROM_FETCH: 'rosterForms/exclude',
    REMOVE_FROM_EXCLUDE: 'rosterForms/removeFromExclude',
    CLEAR_ITEMS: 'rosterForms/clearItems',
  },
  actions: {
    FETCH: 'rosterForms/fetchItems',
    REMOVE_ITEMS: 'rosterForms/removeItems',
    CLEAR_ITEMS: 'rosterForms/clearItems',
  },
};
