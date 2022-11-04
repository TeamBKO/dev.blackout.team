export default {
  methods: {
    async updateMember(payload) {
      try {
        const item = await this.$axios.$patch(
          `/rosters/${this.rosterInfo.id}/members/${payload.id}`,
          payload
        );
        // const members = this.members[this.currentTab].items;
        // if (item.rank) {
        //   const member = members.find(({ id }) => id === item.id);
        //   if (member) {
        //     const rank = member.rank;
        //     Object.assign(rank, item.rank);
        //   }
        // }
        // this.$toast.success('Saved changes.', { position: 'top-center' });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, { position: 'top-center' });
      }
    },
  },
};
