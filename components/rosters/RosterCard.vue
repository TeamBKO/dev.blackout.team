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
      >
        <template #activator="{ on }">
          <v-btn v-on="on" :disabled="hasJoined">Apply</v-btn>
        </template>
      </roster-application-dialog>
      <v-btn :disabled="!hasJoined" v-else>Join</v-btn>
      <v-btn
        class="mx-2"
        :disabled="viewButtonDisabled"
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
import RosterApplicationDialog from '~/components/rosters/RosterApplyFormDialog.vue';
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

  computed: {
    hasJoined() {
      return !!parseInt(this.roster.joined, 10);
    },
    viewButtonDisabled() {
      return this.roster.private && !this.hasJoined;
    },
  },
};
</script>
