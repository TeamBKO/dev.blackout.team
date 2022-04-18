<template>
  <v-app dark>
    <nav-header />
    <v-main>
      <nuxt />
    </v-main>
    <nav-footer />
    <status-dialog />
    <client-only>
      <cookie-policy />
    </client-only>
  </v-app>
</template>

<script>
import NavHeader from '~/components/navigation/NavHeader.vue';
import NavFooter from '~/components/navigation/NavFooter.vue';
import StatusDialog from '~/components/core/StatusDialog.vue';
import CookiePolicy from '~/components/core/CookiePolicy.vue';
export default {
  name: 'DefaultLayout',
  components: {
    NavHeader,
    NavFooter,
    StatusDialog,
    CookiePolicy,
  },
  created() {
    if (!this.$vuetify.theme.dark) {
      this.$vuetify.theme.dark = true;
    }
  },
};
</script>
