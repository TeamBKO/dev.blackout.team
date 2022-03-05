export default function (namespace) {
  return {
    methods: {
      onFilterUpdate() {
        this.$store.dispatch(namespace.actions.RESET_CURSORS);
        this.$store.dispatch(namespace.actions.FETCH);
      },
      onFilterReset() {
        // this.$store.dispatch(obj.actions.RESET_CURSOR);
        // this.$store.commit(filters.mutations.RESET_FILTER, name);
        this.$store.dispatch(namespace.actions.CLEAR_ITEMS);
        this.$store.dispatch(namespace.actions.FETCH);
      },
    },
  };
}
