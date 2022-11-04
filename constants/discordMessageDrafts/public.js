export default {
  getters: {
    ITEMS: 'discordMessageDrafts/items',
    LOADING: 'discordMessageDrafts/isLoading',
    HAS_MORE: 'discordMessageDrafts/hasMore',
    QUERY_PARAMS: 'discordMessage/queryParams',
  },
  mutations: {
    SET_ITEMS: 'discordMessageDrafts/setItems',
    SET_LOADING: 'discordMessageDrafts/setLoading',
    SET_HAS_MORE: 'discordMessageDrafts/setHasMore',
    ADD_ITEM: 'discordMessageDrafts/addItem',
    UPDATE_ITEM: 'discordMessageDrafts/updateItem',
    REMOVE_ITEMS: 'discordMessageDrafts/removeItems',
    EXCLUDE_FROM_FETCH: 'discordMessageDrafts/exclude',
    REMOVE_FROM_EXCLUDE: 'discordMessageDrafts/removeFromExclude',
    CLEAR_ITEMS: 'discordMessageDrafts/cleardiscord',
  },
  actions: {
    FETCH: 'discordMessageDrafts/fetchDiscordMessageDrafts',
    RESET_CURSORS: 'discordMessageDrafts/resetCursors',
    ADD_ITEM: 'discordMessageDrafts/addDiscordMessageDraft',
    UPDATE_ITEM: 'discordMessageDrafts/updateDiscordMessageDraft',
    REMOVE_ITEMS: 'discordMessageDrafts/removeItems',
    CLEAR_ITEMS: 'discordMessageDrafts/clearItems',
  },
};
