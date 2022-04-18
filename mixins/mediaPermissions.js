export default {
  computed: {
    canUpload() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_MEDIA],
        [this.$permissions.ADD_OWN_MEDIA],
      ]);
    },

    canView() {
      return this.$auth.hasScope([
        [this.$permissions.VIEW_ALL_MEDIA],
        [this.$permissions.VIEW_OWN_MEDIA],
      ]);
    },

    displayMediaDialog() {
      return this.canUpload || this.canView;
    },
  },
};
