export default function (obj) {
  return {
    beforeRouteLeave(to, from, next) {
      this.$store.dispatch(obj.actions.CLEAR_ITEMS);
      next();
    },
  };
}
