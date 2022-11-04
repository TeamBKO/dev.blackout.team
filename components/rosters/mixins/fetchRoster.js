import pickBy from 'lodash/pickBy';
import setRosterForm from '../helpers/setRosterForm.js';
import RANKS from '~/constants/rosters/ranks/public.js';
const isTrue = (value) => value === true;

export default {
  methods: {
    async fetchRoster() {
      try {
        const { members, member, ranks, roster_form, ...roster } =
          await this.$axios.$get(`/rosters/${this.$route.params.slug}`);

        if (roster_form) {
          this.rosterInfo.roster_form = roster_form;
          setRosterForm.call(this, roster_form);
        }

        if (ranks?.length) {
          this.$store.commit(RANKS.mutations.SET_ITEMS, ranks);
          this.$store.commit(RANKS.mutations.SET_HAS_MORE, false);
        }

        if (members?.results?.length) {
          this.setPageInfo(members);
        }

        if (member) {
          const { permissions, ...currentMember } = member;
          this.currentMember = currentMember;
          this.permissions = Object.assign(
            this.permissions,
            pickBy(currentMember.rank.permissions, isTrue),
            pickBy(permissions, isTrue)
          );
        }

        this.setRosterData(roster);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
