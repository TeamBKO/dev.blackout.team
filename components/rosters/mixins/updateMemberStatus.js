export default {
  methods: {
    async updateMemberStatus(id, user_id, status) {
      const payload = { status };
      let url = `/rosters/members/status/${id}`;

      if (this.applyRoles && !this.selected.length) {
        Object.assign(payload, { userID: user_id });
      }

      if (!id && this.selected.length) {
        url = '/rosters/members/status';
        if (this.selected.length === 1) {
          url = `/rosters/members/status/${this.selected[0].id}`;
          if (this.applyRoles) {
            Object.assign(payload, { userID: user_id });
          }
        } else {
          Object.assign(payload, {
            members: this.selected.map(({ id, userID }) => ({ id, userID })),
          });
        }
      }

      try {
        const members = await this.$axios.$patch(url, payload);
        const currentTab = this.currentTab;
        const current = this.members[currentTab];
        if (members) {
          if (Array.isArray(members)) {
            const target = this.members[members[0].status];

            target.exclude = members.map(({ id }) => id);
            target.items.unshift(...members);
            current.items = current.items.filter(
              ({ id }) => !target.exclude.includes(id)
            );
          } else {
            const target = this.members[members.status];
            target.exclude.push(members.id);
            const idx = current.items.findIndex(({ id }) => id === members.id);
            if (idx !== -1) {
              current.items.splice(idx, 1);
              target.items.unshift(members);
            }
          }
        }

        this.$toast.success('Saved changes.', { position: 'top-center' });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }
    },
  },
};
