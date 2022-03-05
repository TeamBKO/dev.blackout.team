<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card :minWidth="minWidth">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="$auth.user.avatar" alt="" v-if="$auth.user.avatar" />
            <span v-else>{{ initials }}</span>
          </v-list-item-avatar>
          <v-list-item-content v-if="$auth.loggedIn && displayMenuUser">
            <v-list-item-title>{{ username }}</v-list-item-title>
            <v-list-item-subtitle>Member</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item nuxt :to="'/admin'" v-if="$auth.hasScope(permissions)">
          <v-list-item-icon>
            <v-icon v-text="'mdi-shield'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Admin CP</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <nav-list-item
          v-for="(link, idx) in links"
          :key="idx"
          :item="link"
        ></nav-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon v-text="'mdi-logout'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import NavListItem from './NavListItem.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import avatar from '~/mixins/avatar.js';
export default {
  name: 'UserPanel',
  components: { NavListItem },

  props: {
    links: {
      type: Array,
      default: () => [],
    },

    displayMenuUser: {
      type: Boolean,
      default: true,
    },

    displayToggleUser: {
      type: Boolean,
      default: false,
    },

    hideOnMobile: {
      type: Boolean,
      default: true,
    },

    avatarColor: {
      type: String,
      default: '#0a0a0a',
    },

    avatarSize: {
      type: [Number, String],
      default: 32,
    },

    minWidth: {
      type: [Number, String],
      default: 300,
    },
  },

  data() {
    return {
      menu: false,
    };
  },

  methods: {
    logout() {
      this.$auth.logout();
    },
  },

  computed: {
    avatarClasses() {
      return ['user-panel-avatar', { 'hidden-sm-and-down': this.hideOnMobile }];
    },

    permissions() {
      return this.$permissions.VIEW_ALL_ADMIN;
    },

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

<style lang="scss">
.user-panel-avatar {
  cursor: pointer;
}
</style>
