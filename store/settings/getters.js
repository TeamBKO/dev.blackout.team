import type from '~/constants/settings/private.js';
import pick from 'lodash/pick';
const getters = {
  [type.getters.SETTINGS]: (state) => (settings) => {
    return typeof settings !== undefined && Array.isArray(settings)
      ? pick(state, settings)
      : state;
  },
  [type.getters.SETTINGS_VALUES]: (state) => (settings) => {
    if (typeof settings !== undefined) {
      if (Array.isArray(settings) && settings.length) {
        return settings.map((key) => ({ [key]: state[key].value }));
      } else {
        return state[settings].value;
      }
    } else {
      return Object.entries(state).map(([key, item]) => ({
        [key]: item.vlaue,
      }));
    }
  },

  [type.getters.TIME]: (state) => {
    const intervalType = state.timeTillNextUsernameChange.selected;
    const interval = state.timeTillNextUsernameChange.value;

    switch (intervalType) {
      case 'hour':
        return 60 * 60 * interval;
      case 'day':
        return 60 * 60 * 24 * interval;
      case 'week':
        return 60 * 60 * 24 * 7 * interval;
      case 'month':
        return 60 * 60 * 24 * 30 * interval;
      default:
        break;
    }
  },
};

export default getters;
