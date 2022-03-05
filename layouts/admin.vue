<template>
  <v-app light>
    <admin-navbar />
    <v-main id="admin">
      <nuxt />
    </v-main>
    <status-dialog />
  </v-app>
</template>

<script>
import AdminNavbar from '~/components/navigation/admin/AdminNavbar.vue';
import StatusDialog from '~/components/core/StatusDialog.vue';
export default {
  name: 'Admin',
  components: { AdminNavbar, StatusDialog },
  created() {
    this.$vuetify.theme.dark = false;
  },
};
</script>

<style lang="scss">
#admin {
  // background-color: #f1f1f1;
  background-color: rgba(249, 250, 251);
}

.toasted-container {
  font-family: 'Roboto', sans-serif;
}
</style>
