import SETTINGS from '~/constants/settings/private.js';
import POLICIES from '~/constants/policies/private.js';
const actions = {
  async [SETTINGS.actions.SAVE_SETTINGS]({ commit }, settings) {
    try {
      const sets = (await this.$axios.patch('/admin/settings', { settings }))
        .data;

      commit(SETTINGS.mutations.SET_SETTINGS, sets);
      this.$toast.success('Settings saved.', {
        icon: 'check',
        position: 'top-center',
      });
    } catch (err) {
      this.$toast.error(err.response.data.message, { position: 'top-center' });
    }
  },
  async [SETTINGS.actions.FETCH]({ commit }) {
    try {
      const settings = (await this.$axios.get('/settings')).data;
      commit(SETTINGS.mutations.SET_SETTINGS, settings);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default actions;
