<template>
  <nav>
    <v-app-bar app flat clipped absolute class="transparent mx-5">
      <v-app-bar-nav-icon
        class="background--white elevation-1"
        @click="toggleDrawer"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <nav-user-menu
        v-if="$auth.loggedIn"
        :displayMenuUser="true"
        :hideOnMobile="false"
        :links="userPanelLinks"
      >
        <template #activator="{ on }">
          <div v-on="on">
            <user-avatar :item="$auth.user" :size="40"></user-avatar>
          </div>
        </template>
      </nav-user-menu>
    </v-app-bar>
    <admin-nav-drawer
      v-model="showDrawer"
      :links="links"
      :title.sync="title"
    ></admin-nav-drawer>
  </nav>
</template>

<script>
import page from '~/constants/page/public.js';
import AdminNavDrawer from './AdminNavDrawer.vue';
import AdminUserMenu from './AdminUserMenu.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import NavUserMenu from '../NavUserMenu.vue';
export default {
  name: 'AdminNavbar',
  components: { AdminUserMenu, AdminNavDrawer, UserAvatar, NavUserMenu },

  data() {
    return {
      showDrawer: false,

      userPanelLinks: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
      ],

      links: [
        {
          icon: 'mdi-gauge',
          title: 'Dashboard',
          to: '/admin',
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/admin/settings',
          scope: this.$permissions.VIEW_ALL_SETTINGS,
        },
        {
          icon: 'mdi-note-outline',
          title: 'Posts',
          children: [
            {
              title: 'Testimonies',
              to: '/admin/posts/testimonies',
            },
          ],
        },
        {
          icon: 'mdi-account-group',
          title: 'Users',
          to: '/admin/users',
          scope: this.$permissions.VIEW_ALL_USERS,
        },
        {
          icon: 'mdi-note-plus',
          title: 'Forms',
          to: '/admin/forms',
          scope: [
            this.$permissions.VIEW_ALL_ADMIN,
            this.$permissions.VIEW_ALL_FORMS,
          ],
        },
        {
          icon: 'mdi-clipboard-list',
          title: 'Rosters',
          to: '/admin/rosters',
          scope: [
            this.$permissions.VIEW_ALL_ADMIN,
            this.$permissions.VIEW_ALL_FORMS,
          ],
        },
        {
          icon: 'mdi-account-star',
          title: 'Roles',
          to: '/admin/roles',
          scope: this.$permissions.VIEW_ALL_ROLES,
        },
        {
          icon: 'mdi-file-image',
          title: 'Media',
          to: '/admin/media',
          scope: this.$permissions.VIEW_ALL_MEDIA,
        },
        {
          icon: 'mdi-shape',
          title: 'Categories',
          to: '/admin/categories',
          scope: this.$permissions.VIEW_ALL_CATEGORIES,
        },
        {
          icon: 'mdi-tag-multiple',
          title: 'Tags',
          to: '/admin/tags',
          scope: this.$permissions.VIEW_ALL_TAGS,
        },
        {
          icon: 'mdi-note-plus',
          title: 'Recruitment',
          scope: this.$permissions.VIEW_ALL_FORMS,
          children: [
            {
              title: 'Form Templates',
              to: '/admin/recruitment/templates',
            },
            {
              title: 'Applicants',
              to: '/admin/recruitment',
            },
          ],
        },
      ],
    };
  },

  methods: {
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
  },

  computed: {
    title() {
      return this.$store.getters[page.getters.TITLE];
    },
  },
};
</script>

<style scoped>
.background--white {
  background-color: #fff;
}
</style>
