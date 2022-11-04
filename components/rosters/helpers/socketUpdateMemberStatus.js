export default function updateMemberStatusThroughSockets(members, source) {
  if (Array.isArray(members)) {
    const status = members[0].status;
    const target = this.members[status];

    target.exclude = target.exclude.concat(members.map(({ id }) => id));
    target.items.unshift(...members);

    let text = `Moved ${members.length} to ${status.toUpperCase()}`;

    if (source) {
      const src = this.members[source];
      src.items = src.items.filter(
        ({ id }) => !this.members[status].exclude.includes(id)
      );
      text = `Moved ${
        members.length
      } members from ${source.toUpperCase()} to ${status.toUpperCase()}`;
    }

    this.$toast.success(text, { position: 'top-center', duration: 5000 });
  } else {
    const status = members.status;
    const target = this.members[status];

    target.exclude.push(members.id);
    target.items.unshift(members);

    if (source) {
      const src = this.members[source];
      const idx = src.items.findIndex(({ id }) => id === members.id);
      if (idx !== -1) {
        src.items.splice(idx, 1);
      }
    }

    const text = `${members.username} has joined.`;
    this.$toast.success(text, { position: 'top-center', duration: 5000 });
  }
}
