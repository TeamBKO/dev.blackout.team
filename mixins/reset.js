import filters from '~/constants/filters/public.js';
export default function (filter) {
  return {
    beforeRouteLeave(to, from, next) {
      this.$store.commit(filters.mutations.RESET_FILTER, filter);
      next();
    },
  };
}
