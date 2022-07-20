export default {
  methods: {
    async updateMemberRank(id, { rank, previous }) {
      try {
        const item = await this.$axios.$patch(`/rosters/members/${id}`, {
          roster_rank_id: rank.id,
        });

        console.log(item);

        if (item) {
          if (item.id === this.currentMember.id) {
            const { permissions, ...rank } = item;
            this.currentMember.rank = rank;
            if (permissions) {
              this.permissions = Object.assign(this.permissions, permissions);
            }
          }

          const members = this.members[this.currentTab].items;
          const member = members.find(({ id }) => id === item.id);
          if (member) {
            const rank = member.rank;
            Object.assign(rank, item.rank);
          }
          const message = `Changed rank from ${previous.name} to ${member.rank.name} on ${item.username}`;
          this.$toast.success(message, { position: 'top-center' });
        }
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, { position: 'top-center' });
      }
    },
  },
};
