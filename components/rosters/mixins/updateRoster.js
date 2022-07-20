export default {
  methods: {
    async updateRoster(url) {
      const data = {};
      if (url !== this.banner) {
        Object.assign(data, { banner: url });
      }

      try {
        const item = this.$axios.$patch(`/roster/${this.rosterInfo.id}`, data);

        if (item) {
          this.setRosterData(item);
        }

        this.$toast.success(`Saved changes.`, { position: 'top-center' });
      } catch (err) {
        this.$toast.success(err.message, { position: 'top-center' });
      }
    },
  },
};
