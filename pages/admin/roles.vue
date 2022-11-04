<template>
  <section id="roles">
    <v-container fluid>
      <v-row>
        <v-col md="6" sm="12"> </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <table-delete-dialog
              v-model="openDeleteDialog"
              v-if="canDeleteAll"
              @deleteAll="onDelete"
              @cancel="onCancel"
              :single="single"
              :length="selectedItems.length"
            ></table-delete-dialog>
            <v-btn text @click="$refs.role.setNewContent()" v-if="canAddAll">
              <v-icon left>mdi-plus</v-icon>
              <span>Add Role</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :show-select="canDeleteAll"
            class="elevation-1"
            v-model="selectedItems"
            hide-default-footer
            disable-pagination
            :items="roles"
            :headers="headers"
            :item-key="'id'"
          >
            <template #item.name="{ item }" v-if="canUpdateAll">
              <table-field
                validate
                :endpoint="'role'"
                :value="item.name"
                @save="updateRole(item.id, 'name', $event)"
              ></table-field>
            </template>
            <template #item.members="{ item }">
              {{ item.members }}
            </template>
            <template #item.level="{ item }" v-if="canUpdateAll">
              <table-field
                :validate="false"
                :items="levelOptions"
                :value="item.level"
                @save="updateRole(item.id, 'level', $event)"
              ></table-field>
            </template>
            <template #item.actions="{ item }" v-if="displayActions">
              <div class="text-right">
                <table-actions
                  @view="$refs.role.setEditableContent(item.id, true)"
                  @edit="$refs.role.setEditableContent(item.id)"
                  @remove="setItemForRemoval(item.id)"
                  :isDeletable="item.is_deletable"
                  :actions="actions"
                  :suffix="validate.roles.name"
                ></table-actions>
              </div>
            </template>
          </v-data-table>
          <div
            class="d-flex justify-center align-center py-2"
            v-intersect="{ options: { threshold: 1.0 }, handler: onIntersect }"
            v-if="roles.length && hasMore"
          >
            <v-progress-circular
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
      <role-dialog
        v-if="canAddAll || canUpdateAll"
        ref="role"
        :policyList="policyList"
        :discordRoleList="discordRoleList"
      ></role-dialog>
    </v-container>
  </section>
</template>

<script>
import setPageTitle from '~/middleware/setPageTitle.js';
import createPolicyList from '~/utilities/createPolicyList.js';

import ROLES from '~/constants/roles/public.js';

import TableActions from '~/components/controls/Actions.vue';
import TableInput from '~/components/inputs/TableInput.vue';
import TableDeleteDialog from '~/components/dialogs/DeleteDialog.vue';
import TableField from '~/components/controls/TableField.vue';
import RoleDialog from '~/components/roles/RoleDialog.vue';

import itemManagement from '~/mixins/itemManagement.js';
import clearPage from '~/mixins/clearPage.js';

const range = (start, end) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
};

export default {
  layout: 'admin',
  name: 'AdminRoles',

  components: {
    TableActions,
    TableInput,
    TableDeleteDialog,
    TableField,
    RoleDialog,
  },

  mixins: [itemManagement(ROLES, 'openDeleteDialog')],

  middleware: [
    'auth',
    setPageTitle('View Roles'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_ROLES];
      if ($auth.loggedIn) {
        if (!$auth.hasScope(perms)) {
          redirect('/');
        }
        store.dispatch(ROLES.actions.FETCH);
      } else {
        redirect('/');
      }
    },
  ],

  data() {
    return {
      icon: 'mdi-trash-can-outline',
      editIcon: 'mdi-pencil-outline',
      openDeleteDialog: false,

      suffix: 'roles',

      policyList: {},
      discordRoleList: [],

      actions: [
        {
          icon: 'mdi-eye',
          scope: [this.$permissions.VIEW_ALL_ROLES],
          text: 'View',
        },
        {
          icon: 'mdi-pencil',
          scope: [this.$permissions.UPDATE_ALL_ROLES],
          text: 'Edit',
        },
        {
          icon: 'mdi-delete',
          scope: [this.$permissions.DELETE_ALL_ROLES],
          text: 'Remove',
        },
      ],

      validate: {
        roles: {
          name: 'roles',
          value: 'name',
        },
      },
    };
  },

  methods: {
    async updateRole(id, name, value) {
      const details = { [name]: value };
      console.log(details);
      this.$store.dispatch(
        ROLES.actions.UPDATE_ITEM,
        Object.assign({}, { id, payload: { details } })
      );
    },

    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.roles.length && this.hasMore) {
        this.$store.dispatch(ROLES.actions.FETCH, { loading: true });
      }
    },
  },
  computed: {
    hasMore() {
      this.$store.getters[ROLES.getters.HAS_MORE];
    },

    loading() {
      return this.$store.getters[ROLES.getters.LOADING];
    },

    headers() {
      return [
        { text: 'NAME', align: 'start', value: 'name' },
        { text: 'MEMBERS', align: 'start', value: 'members' },
        { text: 'LEVEL', align: 'start', value: 'level' },
        { text: 'CREATED AT', align: 'start', value: 'created_at' },
        { text: 'UPDATED AT', align: 'start', value: 'updated_at' },
        {
          text: this.$vuetify.breakpoint.mobile ? 'ACTIONS' : '',
          sortable: false,
          align: 'end',
          value: 'actions',
        },
      ];
    },

    levelOptions() {
      return range(this.$auth.user.level, 5);
    },

    roles() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },

    canUpdateAll() {
      return this.$auth.hasScope(this.$permissions.UPDATE_ALL_ROLES);
    },

    canAddAll() {
      return this.$auth.hasScope(this.$permissions.ADD_ALL_ROLES);
    },

    canDeleteAll() {
      return this.$auth.hasScope(this.$permissions.DELETE_ALL_ROLES);
    },

    displayActions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_ROLES],
        [this.$permissions.UPDATE_ALL_ROLES],
        [this.$permissions.DELETE_ALL_ROLES],
      ]);
    },
  },
};
</script>
