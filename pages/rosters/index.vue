<template>
  <section id="rosters">
    <parallax-banner :title="title"></parallax-banner>
    <v-container>
      <v-row>
        <v-col cols="12"><bread-crumbs /></v-col>
      </v-row>
      <v-row>
        <v-col md="4" cols="12" v-for="roster in rosters" :key="roster.id">
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
    </v-container>
  </section>
</template>

<script>
import ROSTERS from '~/constants/rosters/public.js';
import ParallaxBanner from '~/components/core/Parallax.vue';
import RosterCard from '~/components/rosters/RosterCard.vue';
import BreadCrumbs from '~/components/controls/BreadCrumbs.vue';
export default {
  name: 'PublicRosters',

  components: { ParallaxBanner, BreadCrumbs, RosterCard },

  middleware: [
    async ({ store, $auth, redirect }) => {
      if (!$auth.loggedIn) {
        return redirect('/');
      }
      await store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
    },
  ],

  head() {
    return {
      title: 'Rosters',
    };
  },

  data() {
    return {
      title: 'Rosters',
      openFormDialog: false,
    };
  },

  methods: {
    async joinRoster(id) {},
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
  },
};
</script>
