<template>
  <section id="user-table">
    <v-container fluid>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field
            v-model="searchByUsername"
            filled
            :label="'Search by username'"
            :prepend-inner-icon="'mdi-magnify'"
            :append-icon="'mdi-close'"
            @click:append="searchByUsername = ''"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <v-spacer></v-spacer>
            <v-btn text @click="openFilters">
              <v-icon left>mdi-filter-variant</v-icon>
              <span>Filters</span>
            </v-btn>
            <table-delete-dialog
              v-model="openDeleteDialog"
              v-if="canDeleteAll"
              :length="selectedItems.length"
              :single="single"
              @deleteAll="onDelete"
              @cancel="onCancel"
            ></table-delete-dialog>
            <v-btn text @click="openUserDialog = true" v-if="canAddAll">
              <v-icon left>mdi-plus</v-icon>
              <span>Add User</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            id="users"
            show-select
            class="elevation-1"
            v-model="selectedItems"
            hide-default-footer
            disable-pagination
            :items-per-page="-1"
            :items="users"
            :headers="headers"
            :item-key="'id'"
          >
            <template #item.username="{ item }">
              <v-list-item class="px-0">
                <v-list-item-avatar>
                  <user-avatar :item="item" :size="40" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="canUpdateAll">
                    <table-field
                      validate
                      :endpoint="'username'"
                      :id="item.id"
                      :value="item.username"
                      @save="updateUser(item.id, 'username', $event)"
                    ></table-field>
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    {{ item.username }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template #item.email="{ item }" v-if="canUpdateAll">
              <table-field
                validate
                :endpoint="'email'"
                :id="item.id"
                :value="item.email"
                @save="updateUser(item.id, 'email', $event)"
              ></table-field>
            </template>
            <template v-slot:item.roles="{ item }">
              <user-table-roles
                :userId="item.id"
                :roles="item.roles"
              ></user-table-roles>
            </template>
            <template #item.active="{ item }">
              <v-icon>{{
                item.active ? 'mdi-check-decagram' : 'mdi-close-circle'
              }}</v-icon>
            </template>
            <template #item.actions="{ item }" v-if="displayActions">
              <table-actions
                @edit="$refs.userDialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="tableActionSuffix"
                :isDeletable="item.is_deletable"
              ></table-actions>
            </template>
            <template #footer> </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div
            class="d-flex justify-center align-center py-2"
            v-intersect.quiet="{
              options: { threshold: 1.0 },
              handler: onUserIntersect,
            }"
            v-if="users.length && hasMore"
          >
            <v-progress-circular
              color="blue-grey"
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <media-dialog
      v-model="openMediaDialog"
      single
      header
      fullscreen
      :title="'Select a profile avatar'"
      :fileSize="fileSize"
      @setImage="$refs.userDialog.setAvatar($event)"
    ></media-dialog>
    <user-dialog
      v-model="openUserDialog"
      ref="userDialog"
      @edit-profile-image="openMedia"
    ></user-dialog>
    <filter-side-menu
      v-model="openFilterSideMenu"
      show-search
      :search.sync="searchByUsername"
      :namespace="'users'"
      :items="filters"
      :panelHeaders="['Roles', 'Verified']"
      @update="onFilterUpdate"
      @reset="onFilterReset"
      @page:roles="onRolesIntersect"
    ></filter-side-menu>
  </section>
</template>

<script>
import USERS from '~/constants/users/public.js';
import ROLES from '~/constants/roles/public.js';

import setPageTitle from '~/middleware/setPageTitle.js';

import createPolicyList from '~/utilities/createPolicyList.js';

import itemManagement from '~/mixins/itemManagement.js';
import filters from '~/mixins/filters.js';
import clearPage from '~/mixins/clearPage.js';
import filterByInput from '~/mixins/filterByInput.js';

import TableInput from '~/components/inputs/TableInput.vue';
import TableActions from '~/components/controls/Actions.vue';
import TableField from '~/components/controls/TableField.vue';
import TableDeleteDialog from '~/components/dialogs/DeleteDialog.vue';

import UserDialog from '~/components/users/UserDialog.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import UserTableRoles from '~/components/users/UserRoles.vue';

import FilterSideMenu from '~/components/filters/FilterSideMenu.vue';

import MediaDialog from '~/components/media/MediaDialog.vue';

export default {
  layout: 'admin',
  name: 'AdminUsersPage',

  mixins: [
    filters(USERS),
    // clearPage(USERS),
    itemManagement(USERS, 'openDeleteDialog'),
    filterByInput(USERS, 'searchByUsername'),
  ],

  components: {
    TableInput,
    TableActions,
    TableDeleteDialog,
    TableField,
    UserDialog,
    UserAvatar,
    UserTableRoles,
    MediaDialog,
    FilterSideMenu,
  },

  middleware: [
    'auth',
    setPageTitle('View Users'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_USERS];

      if (!$auth.hasScope(perms)) return redirect('/');
      if (!store.getters[USERS.getters.ITEMS].length) {
        store.dispatch(USERS.actions.FETCH, { loading: false });
      }
    },
  ],

  data() {
    return {
      tableActionSuffix: 'users',
      icon: 'mdi-trash-can-outline',

      openDeleteDialog: false,
      openMediaDialog: false,
      openFilterSideMenu: false,
      openUserDialog: false,

      fileSize: 700000,

      actions: [
        {
          icon: 'mdi-eye',
          scope: [this.$permissions.VIEW_ALL_USERS],
          text: 'View',
        },
        {
          icon: 'mdi-pencil',
          scope: [this.$permissions.UPDATE_ALL_USERS],
          text: 'Edit',
        },
        {
          icon: 'mdi-delete',
          scope: [this.$permissions.DELETE_ALL_USERS],
          text: 'Remove',
        },
      ],
    };
  },
  methods: {
    updateUser(id, name, value) {
      const details = { [name]: value };
      this.$store.dispatch(
        USERS.actions.UPDATE,
        Object.assign({ id, details })
      );
    },

    onUserIntersect(observer, entries, isIntersecting) {
      console.log('intersecting');
      if (isIntersecting && this.users.length) {
        this.$store.dispatch(USERS.actions.FETCH, { loading: true });
      }
    },

    onRolesIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.roles.length) {
        this.$store.dispatch(ROLES.actions.FETCH, { loading: true });
      }
    },

    openFilters() {
      if (this.roles.length) {
        this.$store.dispatch(ROLES.actions.FETCH, { loading: true });
      }
      this.openFilterSideMenu = true;
    },

    // fetchUsers(loader, isInitial = this.isInitialLoad) {
    //   return this.$store.dispatch(USERS.actions.FETCH, { loader, isInitial });
    // },

    // async onUpdate(loader) {
    //   if (this.isInitialLoad) {
    //     const { roles, policies } = await this.fetchUsers(loader);
    //     this.roleList = roles;
    //     this.policyList = createPolicyList(policies);
    //     this.isInitialLoad = false;
    //   } else {
    //     await this.fetchUsers(loader);
    //   }
    // },

    openMedia() {
      this.openMediaDialog = true;
    },
  },

  computed: {
    headers() {
      return [
        { text: 'USERNAME', sortable: true, value: 'username' },
        { text: 'EMAIL', sortable: true, value: 'email' },
        { text: 'ROLES', sortable: false, value: 'roles' },
        { text: 'VERIFIED', sortable: true, value: 'active' },
        { text: 'JOINED ON', sortable: true, value: 'created_at' },
        { text: 'UPDATED ON', sortable: true, value: 'updated_at' },

        {
          text: this.$vuetify.breakpoint.mobile ? 'ACTIONS' : '',
          sortable: false,
          value: 'actions',
          align: 'end',
        },
      ];
    },

    canUpdateAll() {
      return this.$auth.hasScope(this.$permissions.UPDATE_ALL_USERS);
    },

    canAddAll() {
      return this.$auth.hasScope(this.$permissions.ADD_ALL_USERS);
    },

    canDeleteAll() {
      return this.$auth.hasScope(this.$permissions.DELETE_ALL_USERS);
    },

    displayActions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_USERS],
        [this.$permissions.UPDATE_ALL_USERS],
        [this.$permissions.DELETE_ALL_USERS],
      ]);
    },

    users() {
      return this.$store.getters[USERS.getters.ITEMS];
    },

    roles() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },

    loading() {
      return this.$store.getters[USERS.getters.LOADING];
    },

    hasMore() {
      return this.$store.getters[USERS.getters.HAS_MORE];
    },

    filters() {
      return [
        {
          name: 'Roles',
          filterBy: 'roles.id',
          itemText: 'name',
          itemValue: 'id',
          list: this.roles,
          multiple: true,
          pagination: {
            cursor: true,
          },
        },
        {
          name: 'Verified',
          filterBy: 'active',
          itemValue: 'status',
          list: [
            { name: 'Active', status: true },
            { name: 'Inactive', status: false },
          ],
          multiple: true,
        },
      ];
    },
  },
};
</script>
