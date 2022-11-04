export default function socketUpdateMember(member) {
  const members = this.members[member.status].items;

  // let _member = members.find(({ id }) => id === member.id);

  const idx = members.findIndex(({ id }) => id === member.id);

  if (idx !== -1) {
    const m = Object.assign(members[idx], member);
    members.splice(idx, 1, m);
    // const idx = members.findIndex(({ id }) => id === member.id);
    // if (idx !== -1) members.splice(idx, 1, m);
  }
}
