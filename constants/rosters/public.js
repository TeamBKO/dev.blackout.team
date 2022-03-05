export default {
  getters: {
    ITEMS: 'rosters/items',
    SELECTED: 'rosters/selected',
    SELECTED_IDS: 'rosters/selectedIds',
    QUERY_PARAMS: 'rosters/queryParams',
    HAS_MORE: 'rosters/hasMore',
  },
  mutations: {
    ADD_ITEM: 'rosters/addItem',
    SET_ITEMS: 'rosters/setItems',
    SET_SELECTED: 'rosters/setSelected',
    UPDATE_ITEM: 'rosters/updateRoster',
    REMOVE_ITEM: 'rosters/removeRoster',
    SET_PARAM: 'rosters/setParam',
    SET_HAS_MORE: 'rosters/setHasMore',
    EXCLUDE_FROM_FETCH: 'rosters/exclude',
    REMOVE_FROM_EXCLUDE: 'rosters/removeFromExclude',
    CLEAR_ITEMS: 'rosters/clearItems',
  },
  actions: {
    FETCH: 'rosters/fetchRosters',
    RESET_CURSORS: 'rosters/resetCursors',
    ADD_ITEM: 'rosters/addRoster',
    UPDATE_ITEM: 'rosters/updateRosters',
    REMOVE_ITEMS: 'rosters/removeItems',
    CLEAR_ITEMS: 'rosters/clearItems',
  },
};
