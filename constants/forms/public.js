export default {
  getters: {
    ITEMS: 'forms/items',
    QUERY_PARAMS: 'forms/queryParams',
    SELECTED: 'forms/selected',
    SELECTED_IDS: 'forms/selectedIds',
    LOADING: 'forms/isLoading',
    HAS_MORE: 'forms/hasMore',
  },
  mutations: {
    ADD_ITEM: 'forms/addItem',
    REMOVE_ITEMS: 'forms/removeItems',
    SET_SELECTED: 'forms/setSelected',
    SET_ITEMS: 'forms/setItems',
    SET_PARAM: 'forms/setParam',
    SET_HAS_MORE: 'forms/setHasMore',
    SET_LOADING: 'forms/setLoading',
    EXCLUDE_FROM_FETCH: 'forms/exclude',
    REMOVE_FROM_EXCLUDE: 'forms/removeFromExclude',
    UPDATE_ITEM: 'forms/updateItem',
  },
  actions: {
    ADD_ITEM: 'forms/addItem',
    REMOVE_ITEMS: 'forms/removeItems',
    CLEAR_ITEMS: 'forms/clearItems',
    CLEAR_FORM: 'forms/clearForm',
    FETCH: 'forms/fetchItems',
    RESET_CURSORS: 'forms/resetCursors',
    RESET_FILTERS: 'forms/resetFilters',
  },
};