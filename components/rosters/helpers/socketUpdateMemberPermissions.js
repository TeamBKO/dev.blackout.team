export default function socketUpdateMemberPermissions(id, member) {
  console.log('updating', id, member);

  if (id !== this.currentMember.id) return;

  if (member.rank) {
    this.currentMember.rank = member.rank;
  }

  if (member.permissions) {
    this.permissions = Object.assign(
      this.permissions,
      this.formatPermissions(member.permissions)
    );
  }
}
