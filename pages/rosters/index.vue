<template>
  <section id="rosters">
    <parallax-banner :title="title"></parallax-banner>
    <v-container>
      <v-row>
        <v-col cols="12"><bread-crumbs /></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-tabs
            :vertical="!$vuetify.breakpoint.mobile"
            :grow="$vuetify.breakpoint.mobile"
            v-model="tab"
          >
            <v-tab :class="tabClass">
              <v-icon left>mdi-format-list-numbered</v-icon>
              Rosters
            </v-tab>
            <v-tab :class="tabClass">
              <v-icon left>mdi-format-list-checkbox</v-icon>
              My Applications
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12" md="10">
          <v-tabs-items v-model="tab">
            <v-tab-item transition="fade-transition" :class="'active-tab'">
              <v-row>
                <v-col
                  :md="
                    rosters.length > 1 ? Math.floor(12 / rosters.length) : 12
                  "
                  cols="12"
                  v-for="roster in rosters"
                  :key="roster.id"
                >
                  <roster-card :roster="roster"></roster-card>
                </v-col>
              </v-row>
              <v-row justify="center" align="center">
                <div
                  class="d-flex justify-center align-center py-2"
                  v-if="hasMore"
                  v-intersect.quiet="{
                    options: { threshold: 1.0 },
                    handler: onIntersect,
                  }"
                >
                  <v-progress-circular
                    indeterminate
                    v-if="loading"
                  ></v-progress-circular>
                </div>
              </v-row>
            </v-tab-item>
            <v-tab-item transition="fade-transition" :class="'active-tab'">
              <roster-my-applications
                :isTabActive="showUserRosterApplicationForms"
              ></roster-my-applications>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import ROSTERS from '~/constants/rosters/public.js';
import ParallaxBanner from '~/components/core/Parallax.vue';
import RosterCard from '~/components/rosters/RosterCard.vue';
import BreadCrumbs from '~/components/controls/BreadCrumbs.vue';
import RosterMyApplications from '~/components/rosters/RosterMyApplications.vue';
export default {
  name: 'PublicRosters',

  components: { ParallaxBanner, BreadCrumbs, RosterCard, RosterMyApplications },

  middleware: [
    async ({ store, $auth, redirect }) => {
      if (!$auth.loggedIn) {
        return redirect('/');
      }
      await store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
    },
  ],

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/rosters-index',
      reconnection: true,
      statusProp: 'statusProp',
      auth: {
        token: this.$auth.strategy.refreshToken.get(),
      },
    });

    this.socket.on('update:roster', (info) => {
      console.log('updating roster', info);

      this.$store.commit(ROSTERS.mutations.UPDATE_ITEM, info);
    });
  },

  head() {
    return {
      title: 'Rosters',
    };
  },

  data() {
    return {
      tab: 0,
      statusProp: '',
      socket: null,
      title: 'Rosters',
      openFormDialog: false,
    };
  },

  methods: {
    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.rosters.length && this.hasMore) {
        this.$store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
      }
    },
  },

  computed: {
    loading() {
      return this.$store.getters[ROSTERS.getters.LOADING];
    },
    hasMore() {
      return this.$store.getters[ROSTERS.getters.HAS_MORE];
    },
    rosters() {
      return this.$store.getters[ROSTERS.getters.ITEMS];
    },
    showUserRosterApplicationForms() {
      return this.tab === 1;
    },
    tabClass() {
      return !this.$vuetify.breakpoint.mobile ? 'justify-start' : null;
    },
  },
};
</script>

<style scoped>
.active-tab {
  background-color: #121212;
}
.justify-start {
  justify-content: start;
}
</style>
