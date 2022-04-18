<template>
  <roster-container hide-breadcrumbs>
    <template #prepend>
      <v-row>
        <v-col cols="12" class="my-3">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn text v-on="on" @click="$router.push('/admin/rosters')">
                <v-icon left>mdi-arrow-left</v-icon>
                <span>Back</span>
              </v-btn>
            </template>
            Takes you back to the admin roster page.
          </v-tooltip>
        </v-col>
      </v-row>
    </template>
  </roster-container>
</template>

<script>
import RosterContainer from '~/components/rosters/RosterContainer.vue';
export default {
  name: 'Roster',

  components: { RosterContainer },

  middleware: [
    async ({ store, $auth, $permissions, redirect }) => {
      if (!$auth.hasScope([$permissions.VIEW_ALL_ADMIN])) {
        return redirect('/');
      }
    },
  ],
};
</script>
