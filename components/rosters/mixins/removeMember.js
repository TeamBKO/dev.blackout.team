export default {
  methods: {
    async removeMember(id) {
      let payload = {};
      let url = `/rosters/members/${id}`;
      if (!id && this.selected.length) {
        url = '/rosters/members';
        if (this.selected.length === 1) {
          url = `/rosters/members/${this.selected[0].id}`;
        } else {
          Object.assign(payload, {
            [id ? 'id' : 'ids']: this.selected.reduce((arr, selected) => {
              //if priority is 1, this is the owner and cannot be removed.
              if (selected.rank.priority === 1) {
                return arr;
              }
              arr.push(selected.id);
              return arr;
            }, []),
          });
        }
      }

      let request;
      if (Object.keys(payload).length) {
        request = this.$axios.$delete(url, payload);
      } else {
        request = this.$axios.$delete(url);
      }

      const members = await request;
      const current = this.members[this.currentTab];
      if (members) {
        if (!Array.isArray(members)) {
          const idx = current.items.findIndex(({ id }) => id === members.id);
          if (idx !== -1) {
            const member = current.items.splice(idx, 1)[0];
            this.$toast.success(`Removed member: ${member.username}`, {
              position: 'top-center',
            });
          }

          return;
        }
        const membersToRemove = members.map(({ id }) => id);
        current.items = current.items.filter(
          ({ id }) => !membersToRemove.includes(id)
        );
        this.$toast.success('Removed members.', {
          position: 'top-center',
        });
      }
    },
  },
};
