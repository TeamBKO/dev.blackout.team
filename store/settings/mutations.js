import types from '~/constants/settings/private.js';
import camelCase from 'lodash/camelCase';

const mutations = {
  [types.mutations.SET_SETTINGS](state, settings) {
    Object.keys(settings).forEach((key) => {
      const k = camelCase(key);
      const _state = state[k];
      if (_state && typeof _state !== undefined) {
        if (_state.hasOwnProperty('selected')) {
          const split = settings[key].split(' ');
          _state.value =
            _state.type === 'integer' ? parseInt(split[0], 10) : split[0];
          _state.selected = split[1];
        } else {
          _state.value = settings[key];
        }
      }
    });
  },
};

export default mutations;
