<template>
  <v-list>
    <v-list-group>
      <template #activator>
        <v-list-item-avatar>
          <img :src="$auth.user.avatar" alt v-if="$auth.user.avatar" />
          <span class="white--text headline" v-else>{{ avatar }}</span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ username }}</v-list-item-title>
        </v-list-item-content>
      </template>
      <nav-list-item :item="admin"></nav-list-item>
      <nav-list-item
        v-for="(link, idx) in links"
        :item="link"
        :key="idx"
      ></nav-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
// import NavUserPanelLink from './NavUserPanelLink.vue';
import NavListItem from './NavListItem.vue';
export default {
  name: 'UserPanelMobile',
  components: { NavListItem },

  data() {
    return {
      links: [{ icon: 'mdi-account', title: 'Profile', to: '/profile' }],
      admin: {
        icon: 'mdi-shield',
        title: 'Admin',
        to: '/admin',
        scope: this.$permissions.VIEW_ALL_ADMIN,
      },
    };
  },

  computed: {
    username() {
      return this.$auth.user ? this.$auth.user.username : null;
    },
    initials() {
      if (this.username) {
        const initials = this.username.match(/\b\w/g) || [];
        return (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
      }
    },
    avatar() {
      return this.$auth.user.avatar ? this.$auth.user.avatar : this.initials;
    },
  },
};
</script>
