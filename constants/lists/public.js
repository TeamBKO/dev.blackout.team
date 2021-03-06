export default {
  getters: {
    GET_ITEMS: 'lists/getItems',
    TYPE: 'lists/type',
    SELECTED: 'lists/selected',
    SELECT_IDS: 'lists/selectedIds',
    QUERY_PARAMS: 'lists/queryParams',
    HAS_MORE: 'lists/hasMore',
    LOADING: 'lists/loading',
  },
  mutations: {
    SET_ITEMS: 'lists/setListsData',
    SET_HAS_MORE: 'lists/setHasMore',
    SET_LOADING: 'lists/loading',
    REMOVE_ITEMS: 'lists/removeItems',
    SET_TYPE: 'lists/setType',
    SET_SELECTED: 'lists/setSelected',
    SET_PARAM: 'lists/setParam',
    REMOVE_FROM_EXCLUSION: 'lists/removeFromExclude',
    CLEAR_ITEMS: 'lists/clearItems',
    RESET_PARAMS: 'lists/resetParams',
    UPDATE_ITEM: 'lists/updateItem',
  },
  actions: {
    FETCH: 'lists/fetch',
    RESET_CURSORS: 'lists/restCursors',
    CLEAR_ITEMS: 'lists/clearList',
    REMOVE_ITEMS: 'lists/removeItems',
    ADD_ITEM: 'lists/addItem',
    EDIT_ITEM: 'lists/editItem',
  },
};
