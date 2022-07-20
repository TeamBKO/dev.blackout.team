export default {
  methods: {
    async fetchMembers() {
      const params = {
        status: this.currentTab,
        exclude: this.exclude,
      };
      this.loading = true;
      try {
        const items = await this.$axios.$get(
          `/rosters/${this.rosterInfo.id}/members`,
          { params }
        );
        this.setPageInfo(items);
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
