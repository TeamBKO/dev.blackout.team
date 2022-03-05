<template>
  <section id="roster">
    <div class="v-container" fluid>
      <v-row v-if="goBack">
        <v-col>
          <v-btn>
            <v-icon left>mdi-back</v-icon>
            <span>Back</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field
            v-model="searchByMemberUsername"
            filled
            :label="'Search by username'"
            :prepend-inner-icon="'mdi-magnify'"
            :append-icon="'mdi-close'"
            @click:append="searchByMemberUsername = ''"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <v-spacer></v-spacer>
            <!-- <v-btn text @click="openFilterSideMenu = true">
              <v-icon left>mdi-filter-variant</v-icon>
              <span>Filters</span>
            </v-btn> -->
            <v-btn text>
              <v-icon left>mdi-plus</v-icon>
              <span>Remove Members</span>
            </v-btn>
            <v-btn text>
              <v-icon left>mdi-plus</v-icon>
              <span>Invite Member</span>
            </v-btn>
            <v-btn text>
              <v-icon left>mdi-plus</v-icon>
              <span>Manage Ranks</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            id="roster"
            disable-pagination
            hide-default-footer
            :items="members"
          >
          </v-data-table>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Roster',

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from) {
        vm.from = from.fulPath;
        console.log(from);
      }
    });
  },

  data() {
    return {
      from: null,
    };
  },
};
</script>
