import ROSTERS from '~/constants/rosters/public.js';
export default {
  methods: {
    async deleteRoster() {
      try {
        const roster = await this.$axios.delete(
          `/rosters/${this.rosterInfo.id}`
        );

        this.$store.commit(ROSTERS.mutations.REMOVE_ITEMS, [
          this.rosterInfo.id,
        ]);
        this.$store.commit(ROSTERS.mutations.REMOVE_FROM_EXCLUDE, [
          this.rosterInfo.id,
        ]);

        this.openDeleteRosterPrompt = false;

        this.$toast.success(`Roster: ${roster.name} has been closed.`, {
          position: 'top-center',
        });
        this.$router.push('/rosters');
      } catch (err) {
        this.$toast.error(err.message, { position: 'top-center' });
      }
    },
  },
};
