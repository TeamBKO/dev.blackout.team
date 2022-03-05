<template>
  <v-container fluid>
    <media-container hide-header-title disable-select></media-container>
  </v-container>
</template>

<script>
import MediaContainer from '~/components/media/MediaContainer.vue';
import setPageTitle from '~/middleware/setPageTitle.js';

export default {
  layout: 'admin',
  name: 'AdminMedia',

  components: { MediaContainer },

  middleware: [
    'auth',
    setPageTitle('View Media'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_MEDIA];

      if ($auth.loggedIn) {
        if (!$auth.hasScope(perms)) {
          redirect('/');
        }
      } else {
        redirect('/');
      }
    },
  ],
};
</script>
