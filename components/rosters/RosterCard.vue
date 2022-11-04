<template>
  <v-card>
    <v-img
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,0.5)"
      height="200px"
      :src="roster.banner"
    >
      <v-card-title>
        <v-avatar size="56">
          <img :src="roster.icon" alt="" />
        </v-avatar>
        <span class="ml-3">{{ roster.name }}</span>
      </v-card-title>
    </v-img>

    <v-card-actions>
      <roster-application-dialog
        v-if="roster.roster_form"
        :rosterID="roster.id"
        :rosterSlug="roster.url"
      >
        <template #activator="{ on }">
          <v-btn v-on="on" :disabled="hasJoined">Apply</v-btn>
        </template>
      </roster-application-dialog>
      <v-btn :disabled="hasJoined" @click="joinRoster(roster.id)" v-else
        >Join</v-btn
      >
      <v-btn
        class="mx-2"
        :disabled="viewButtonDisabled"
        :data-button-id="roster.url"
        @click="$router.push(`/rosters/${roster.url}`)"
        >View</v-btn
      >
      <v-spacer></v-spacer>
      <span>
        <v-icon left>mdi-account-group-outline</v-icon>
        <span>{{ roster.members }}</span>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
import ROSTERS from '~/constants/rosters/public.js';
import RosterApplicationDialog from '~/components/rosters/RosterApplyFormDialog.vue';
import isBoolean from 'lodash/isBoolean';
export default {
  name: 'RosterCard',

  components: { RosterApplicationDialog },

  props: {
    roster: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  methods: {
    async joinRoster(id) {
      try {
        const { roster } = await this.$axios.$post(`/rosters/${id}`);

        if (roster) {
          this.$store.commit(ROSTERS.mutations.UPDATE_ITEM, {
            id: roster.id,
            joined: !!parseInt(roster.joined, 10),
            members: roster.members,
          });
        }

        if (this.roster.auto_approve) {
          return this.$toast.success(
            `You've joined ${roster.name.toUpperCase()}.`
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  computed: {
    hasJoined() {
      return isBoolean(this.roster.joined)
        ? this.roster.joined
        : !!parseInt(this.roster.joined, 10);
    },
    viewButtonDisabled() {
      return this.roster.private && !this.hasJoined;
    },
  },
};
</script>
