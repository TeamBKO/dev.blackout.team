<template>
  <nav>
    <v-toolbar id="navbar" :color="color" dark flat height="80px">
      <v-container>
        <v-row justify="center" align="center" class="flex-nowrap">
          <v-app-bar-nav-icon
            class="hidden-md-and-up"
            @click="showMobile = true"
          ></v-app-bar-nav-icon>
          <v-spacer class="hidden-md-and-up"></v-spacer>
          <v-toolbar-title class>
            <img
              class="pt-2"
              src="https://blackout-gaming.s3.amazonaws.com/Images/assets/white-transparent.webp"
              height="72px"
              alt
            />
          </v-toolbar-title>
          <v-tabs
            align-with-title
            v-model="tab"
            class="hidden-sm-and-down"
            :height="'80px'"
          >
            <nav-header-item
              v-for="(link, idx) in links"
              :key="idx"
              :link="link"
              :class="{ 'ml-4': idx === 0 }"
            ></nav-header-item>
            <roster-applicant-dialog
              v-model="showForm"
              v-if="canViewForms"
              :button="true"
            ></roster-applicant-dialog>
            <v-spacer></v-spacer>
            <auth-dialog
              v-model="showAuth"
              v-if="!$auth.loggedIn && displayLocalLogin"
            >
              <template #activator="{ on }">
                <a class="v-tab" v-on="on">
                  <v-icon left>mdi-account-circle</v-icon>
                  <span>Sign In</span>
                </a>
              </template>
            </auth-dialog>
            <div
              class="v-tab"
              v-else-if="!$auth.loggedIn && displaySocialLogin"
            >
              <discord-button :label="'Sign in'"></discord-button>
            </div>
            <nav-user-menu
              :links="navUserMenuItems"
              :avatarSize="32"
              v-else-if="$auth.loggedIn"
            >
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  <v-avatar :size="32" class="mr-2">
                    <v-img
                      :src="$auth.user.avatar"
                      v-if="$auth.user.avatar"
                    ></v-img>
                    <span class="white--text headline" v-else>{{
                      initials
                    }}</span>
                  </v-avatar>
                  <span>{{ $auth.user.username }}</span>
                  <v-icon small>mdi-chevron-down</v-icon>
                </div>
              </template>
            </nav-user-menu>
          </v-tabs>
        </v-row>
      </v-container>
    </v-toolbar>
    <nav-mobile
      v-model="showMobile"
      @toggle="showAuth = !showAuth"
      :links="links"
    ></nav-mobile>
  </nav>
</template>

<script>
import NavUserMenu from './NavUserMenu.vue';
import NavMobile from './NavMobile.vue';
import NavHeaderItem from './NavHeaderItem.vue';
import DiscordButton from '~/components/dialogs/DiscordButton.vue';

import RosterApplicantDialog from '~/components/rosters/RosterApplicantDialog.vue';
import AuthDialog from '~/components/auth/AuthDialog.vue';

import menu from '~/constants/menu/public.js';
import settings from '~/constants/settings/public.js';

export default {
  name: 'NavHeader',
  components: {
    AuthDialog,
    RosterApplicantDialog,
    NavMobile,
    NavHeaderItem,
    NavUserMenu,
    DiscordButton,
  },

  data() {
    return {
      showMobile: false,
      showAuth: false,
      showForm: false,
      tab: null,

      color: '#1E1E1E',

      navUserMenuItems: [
        {
          icon: 'mdi-account-cog',
          title: 'Profile',
          to: `/profile`,
        },
      ],
    };
  },

  computed: {
    links() {
      return this.$store.getters[menu.getters.LINKS];
    },

    canViewEvents() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope(this.$permissions.VIEW_ALL_EVENTS)
      );
    },

    canViewForms() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope(this.$permissions.VIEW_ALL_FORMS)
      );
    },

    displayLocalLogin() {
      return this.enableUserAuthenticate && this.enableLocalAuth;
    },

    enableUserAuthenticate() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'enableUserAuthentication'
      );
    },

    enableLocalAuth() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'enableLocalAuthentication'
      );
    },

    enableSocialAuth() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'enableSocialAuthentication'
      );
    },

    displaySocialLogin() {
      return (
        !this.enableLocalAuth &&
        this.enableSocialAuth &&
        this.enableUserAuthenticate
      );
    },

    initials() {
      if (this.$auth.user.username) {
        const username = this.$auth.user.username;
        const initials = username.match(/\b\w/g) || [];
        return (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
      }
    },
  },
};
</script>
