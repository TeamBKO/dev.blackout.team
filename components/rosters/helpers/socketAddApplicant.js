export default function socketAddApplicant(member) {
  const text = `${member.username} has applied.`;
  this.members.pending.items.unshift(member);
  this.members.pending.exclude.push(member.id);
  this.$toast.success(text, { position: 'top-center', duration: 5000 });
}
