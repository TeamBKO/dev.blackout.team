export default {
  getters: {
    ITEMS: 'ranks/items',
    QUERY_PARAMS: 'ranks/queryParams',
    HAS_MORE: 'ranks/hasMore',
    LOADING: 'ranks/loading',
  },
  mutations: {
    ADD_ITEM: 'ranks/addItem',
    SET_ITEMS: 'ranks/setItems',
    UPDATE_ITEM: 'ranks/updateRoster',
    REMOVE_ITEMS: 'ranks/removeRoster',
    SET_PARAM: 'ranks/setParam',
    SET_HAS_MORE: 'ranks/setHasMore',
    EXCLUDE_FROM_FETCH: 'ranks/exclude',
    REMOVE_FROM_EXCLUDE: 'ranks/removeFromExclude',
    CLEAR_ITEMS: 'ranks/clearItems',
  },
  actions: {
    FETCH: 'ranks/fetchItems',
    ADD_ITEM: 'ranks/addItem',
    UPDATE_ITEM: 'ranks/updateItem',
    REMOVE_ITEM: 'ranks/removeItem',
    CLEAR_ITEMS: 'ranks/clearItems',
  },
};
