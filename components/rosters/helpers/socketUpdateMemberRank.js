export default function socketUpdateMemberRank(member, previous) {
  const members = this.members.approved.items;
  const match = members.find(({ id }) => id === member.id);
  if (match) {
    const rank = match.rank;
    Object.assign(rank, member.rank);
  }
  const message = `Changed rank from ${previous.name} to ${member.rank.name} on ${member.username}`;
  this.$toast.success(message, { position: 'top-center', duration: 3000 });
}
