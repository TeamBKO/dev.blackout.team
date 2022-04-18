import snakeCase from 'lodash/snakeCase';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';

export const mapStateToStore = function mapStateToStore(queryParams, picked) {
  const state = {
    items: [],
    selected: [],
    hasMore: true,
    loading: false,
    queryParams: cloneDeep(queryParams),
  };

  if (Array.isArray(picked) && picked.length) {
    return pick(state, picked);
  }

  return state;
};

export const mapGettersToStore = function mapGettersToStore(
  namespace,
  selected
) {
  const getters = {
    [namespace.getters.ITEMS]: (state) => state.items,
    [namespace.getters.SELECTED]: (state) => state.selected,
    [namespace.getters.SELECTED_IDS]: (state) =>
      state.selected.map(({ id }) => id),
    [namespace.getters.QUERY_PARAMS]: (state) => (key) =>
      typeof key !== undefined ? state.queryParams[key] : state.queryParams,
    [namespace.getters.HAS_MORE]: (state) => state.hasMore,
    [namespace.getters.LOADING]: (state) => state.loading,
  };

  const picked = pick(getters, selected);

  return selected && selected.length ? picked : getters;
};

export const mapMutationsToStore = function mapMutationsToStore(
  namespace,
  key = 'items',
  selectedMutations = [
    'ADD_ITEM',
    'REMOVE_ITEMS',
    'UPDATE_ITEM',
    'SET_ITEMS',
    'SET_PARAM',
    'SET_HAS_MORE',
    'SET_SELECTED',
    'SET_LOADING',
    'EXCLUDE_FROM_FETCH',
    'REMOVE_FROM_EXCLUDE',
    'CLEAR_ITEMS',
  ]
) {
  if (selectedMutations && !Array.isArray(selectedMutations)) {
    throw new Error("argument 'selectedMutations' must be passed as an array.");
  }

  const modules = require.context('~/utilities/store/_mutations', false);

  const mutations = modules
    .keys()
    .map(modules)
    .map((m) => m.default);

  return mutations.reduce((obj, mutation) => {
    const name = snakeCase(mutation.name).toUpperCase();
    if (selectedMutations.includes(name)) {
      if (!obj[namespace.mutations[name]]) {
        if (namespace.mutations[name]) {
          obj[namespace.mutations[name]] = mutation.execute(key);
        }
      }
    }

    return obj;
  }, {});
};

export const mapActionsToStore = function mapActionsToStore(
  namespace,
  optionsObject,
  selectedActions = [
    'FETCH',
    'ADD_ITEM',
    'UPDATE_ITEM',
    'REMOVE_ITEMS',
    'CLEAR_ITEMS',
    'RESET_FILTERS',
    'RESET_CURSORS',
  ]
) {
  if (selectedActions && !Array.isArray(selectedActions)) {
    throw new Error("argument 'selectedActions' must be passed as an array.");
  }
  const modules = require.context('~/utilities/store/_actions', false);

  const actions = modules
    .keys()
    .map(modules)
    .map((m) => m.default);

  return actions.reduce((obj, action) => {
    const name = snakeCase(action.name).toUpperCase();

    if (selectedActions.includes(name)) {
      if (!obj[namespace.actions[name]]) {
        if (namespace.actions[name]) {
          if (optionsObject[name]?.options) {
            // const options = Object.values(optionsObject[name].options);
            const options = optionsObject[name].options;
            obj[namespace.actions[name]] = action.execute(namespace, options);
          } else {
            obj[namespace.actions[name]] = action.execute(namespace);
          }
        }
      }
    }

    return obj;
  }, {});
};
