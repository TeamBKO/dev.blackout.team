<template>
  <roster-container></roster-container>
</template>

<script>
import RANKS from '~/constants/rosters/ranks/public.js';
import clearPage from '~/mixins/clearPage.js';
import RosterContainer from '~/components/rosters/RosterContainer.vue';
export default {
  name: 'RosterPage',

  components: { RosterContainer },

  mixins: [clearPage(RANKS)],

  middleware: [
    ({ $auth, redirect }) => {
      if (!$auth.loggedIn) {
        return redirect('/');
      }
    },
  ],
};
</script>
