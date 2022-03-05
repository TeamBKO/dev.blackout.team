import debounce from 'lodash/debounce';

/**
 * Changes the identifier id forcing the infinite-load component to fetch results.
 * @param {object} store The object containing the namespaces for the store
 * @param {string} valueToWatch The observable
 */

export default function filterByInput(store, valueToWatch) {
  return {
    mounted() {
      const onUpdate = () => {
        this.$store.dispatch(store.actions.RESET_CURSORS);
        this.$store.dispatch(store.actions.FETCH);
      };
      const onInputUpdate = debounce(onUpdate, 300).bind(this);

      this.$watch(valueToWatch, () => {
        this.$nextTick(() => onInputUpdate());
      });
    },
    computed: {
      [valueToWatch]: {
        get() {
          return this.$store.getters[store.getters.QUERY_PARAMS](valueToWatch);
        },
        set(value) {
          this.$store.commit(store.mutations.SET_PARAM, {
            param: valueToWatch,
            value,
          });
        },
      },
    },
  };
}
