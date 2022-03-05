<template>
  <v-navigation-drawer
    class="hidden-md-and-up"
    v-model="show"
    id="mobile"
    absolute
  >
    <template v-if="$auth.loggedIn">
      <nav-user-mobile-menu />
      <v-divider></v-divider>
    </template>
    <template v-else>
      <v-list v-if="localAuthenticationEnabled">
        <v-list-item @click.native="$emit('toggle')">
          <v-list-item-icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="pa-2" v-else>
        <discord-button block :label="'Sign In'"></discord-button>
      </div>
      <v-divider></v-divider>
    </template>
    <v-list nav>
      <nav-list-item
        :item="link"
        v-for="(link, idx) in links"
        :key="idx"
      ></nav-list-item>
    </v-list>
    <template v-if="$auth.loggedIn">
      <v-divider></v-divider>
      <v-list-item link @click="$auth.logout()">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template></v-navigation-drawer
  >
</template>

<script>
import settings from '~/constants/settings/public.js';
import NavUserMobileMenu from './NavUserMobileMenu.vue';
import NavListItem from './NavListItem.vue';
import DiscordButton from '~/components/dialogs/DiscordButton.vue';
export default {
  name: 'NavMobile',
  components: { NavUserMobileMenu, NavListItem, DiscordButton },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    links: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    localAuthenticationEnabled() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'enableLocalAuthentication'
      );
    },

    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
