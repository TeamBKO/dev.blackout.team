export default function (obj) {
  return {
    beforeRouteLeave(to, from, next) {
      console.log('beforeRouteLeave');
      this.$store.dispatch(obj.actions.CLEAR_ITEMS);
      next();
    },
  };
}
