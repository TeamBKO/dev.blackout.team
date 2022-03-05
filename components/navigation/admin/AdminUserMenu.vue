<template>
  <v-menu transition="slide-y-transition" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(link, idx) in links" :key="idx" nuxt :to="link.to">
        <v-list-item-icon>
          <v-icon v-text="link.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-btn flat @click="$auth.logout()">
        <v-icon left v-text="'mdi-logout'"></v-icon>
        <span>Logout</span>
      </v-btn>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'AdminUserMenu',
  data() {
    return {
      links: [{ icon: 'mdi-home', title: 'Home', to: '/' }],
    };
  },
  methods: {
    logout() {
      console.log('Logging out...');
    },
  },
};
</script>
