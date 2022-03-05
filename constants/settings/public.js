export default {
  getters: {
    SETTINGS: 'settings/settings',
    SETTINGS_VALUES: 'settings/settingsValues',
  },
  mutations: {
    SET_SETTING: 'settings/setSetting',
    SET_SETTINGS: 'settings/setSettings',
  },
  actions: {
    SAVE_SETTINGS: 'settings/saveSettings',
    FETCH: 'settings/fetchSettings',
  },
};
