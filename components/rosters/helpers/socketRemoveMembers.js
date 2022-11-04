export default function socketRemoveMembers(members, source) {
  const src = this.members[source];
  const sourceText = source.toUpperCase();
  if (Array.isArray(members)) {
    const remove = members.map(({ id }) => id);

    const isCurrentMember = remove.findIndex(
      (id) => id === this.currentMember.id
    );
    if (idx !== -1) {
      this.currentMember = null;
    }

    src.items = src.items.filter(({ id }) => !remove.includes(id));
    const text = `Removed ${remove.length} from ${sourceText}`;
    this.$toast.success(text, { position: 'top-center', duration: 3000 });
  } else {
    const idx = src.items.findIndex(({ id }) => id === members.id);

    if (this.currentMember.id === members.id) {
      this.currentMember = null;
    }

    if (idx !== -1) {
      src.items.splice(idx, 1)[0];
    }
    const text = `Removed member: ${members.username} from ${sourceText}`;
    this.$toast.success(text, {
      position: 'top-center',
      duration: 3000,
    });
  }
}
