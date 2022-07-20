<template>
  <section id="rosters-table">
    <v-container fluid>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field
            v-model="searchByName"
            filled
            label="'Search by roster name'"
            :prepend-inner-icon="'mdi-magnify'"
            :append-icon="'mdi-close'"
            @click:append="searchByName = ''"
          ></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center">
            <v-spacer></v-spacer>
            <v-btn text @click="openFilterSideMenu = true">
              <v-icon left>mdi-filter-variant</v-icon>
              <span>Filters</span>
            </v-btn>
            <delete-dialog
              v-model="openDeleteDialog"
              v-if="canDeleteAll"
              :length="selectedItems.length"
              :single="single"
              @deleteAll="onDelete"
              @cancel="onCancel"
            ></delete-dialog>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            id="roster-forms"
            :show-select="canDeleteAll"
            class="elevation-1"
            v-model="selectedItems"
            hide-default-footer
            disable-pagination
            :items="forms"
            :headers="headers"
            :item-key="'id'"
          >
            <template #item.username="{ item }">
              <v-list-item class="px-0">
                <v-list-item-avatar>
                  <user-avatar :item="item" :size="40" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.username }}'s Application
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex justify-end">
                <table-actions
                  @remove="setItemForRemoval(item.id)"
                  :actions="actions"
                  :suffix="tableActionSuffix"
                  :isDeletable="item.is_deletable"
                ></table-actions>
              </div>
            </template>
          </v-data-table>
          <div
            class="d-flex justify-center align-center"
            v-intersect.quiet="onIntersect"
            v-if="forms.length && hasMore"
          >
            <v-progress-circular
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js';

import itemManagement from '~/mixins/itemManagement.js';
import filters from '~/mixins/filters.js';
import filterByInput from '~/mixins/filterByInput.js';
import mediaPermissions from '~/mixins/mediaPermissions.js';

import ROSTERFORMS from '~/constants/rosters/forms/public.js';

import UserAvatar from '~/components/avatar/ListAvatar.vue';
import TableActions from '~/components/controls/Actions.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';

export default {
  name: 'RosterMemberForms',
  layout: 'admin',

  middleware: [
    'auth',
    ({ $auth, $permissions, store, redirect, params }) => {
      const { VIEW_ALL_ADMIN } = $permissions;
      if ($auth.loggedIn) {
        if (!$auth.hasScope(VIEW_ALL_ADMIN)) {
          redirect('/');
        }
        if (!store.getters[ROSTERFORMS.getters.ITEMS].length) {
          store.dispatch(ROSTERFORMS.actions.FETCH);
        }
      } else {
        redirect('/');
      }
    },
    setTitle('View Roster Member Forms'),
  ],

  components: {
    TableActions,
    DeleteDialog,
    UserAvatar,
  },

  mixins: [
    itemManagement(ROSTERFORMS, 'openDeleteDialog'),
    filters(ROSTERFORMS),
    filterByInput(ROSTERFORMS, 'searchByName'),
    mediaPermissions,
  ],

  data() {
    return {
      openFilterSideMenu: false,
      openDeleteDialog: false,

      actions: [
        {
          icon: 'mdi-eye',
          scope: [this.$permissions.VIEW_ALL_ADMIN],
          text: 'View',
        },

        {
          icon: 'mdi-delete',
          scope: [this.$permissions.VIEW_ALL_ADMIN],
          text: 'Remove',
        },
      ],

      tableActionSuffix: 'users',
    };
  },

  methods: {
    async onIntersect(entries, observer, isIntersecting) {
      if (this.hasMore && this.rosters.length) {
        if (isIntersecting) {
          this.$store.dispatch(ROSTERFORMS.actions.FETCH, { loading: true });
        }
      }
    },
  },

  computed: {
    canDeleteAll() {
      return this.$auth.hasScope(this.$permissions.VIEW_ALL_ADMIN);
    },

    displayActions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_ROLES],
        [this.$permissions.UPDATE_ALL_ROLES],
        [this.$permissions.DELETE_ALL_ROLES],
      ]);
    },

    forms() {
      return this.$store.getters[ROSTERFORMS.getters.ITEMS];
    },

    hasMore() {
      return this.$store.getters[ROSTERFORMS.getters.HAS_MORE];
    },

    headers() {
      return [
        {
          text: 'APPLICANT',
          sortable: false,
          value: 'username',
        },
        {
          text: 'FORM TEMPLATE',
          sortable: false,
          value: 'formName',
        },
        {
          text: 'ROSTER',
          sortable: false,
          value: 'rosterName',
        },

        { text: 'CREATED AT', sortable: false, value: 'created_at' },
        { text: 'UPDATED AT', sortable: false, value: 'updated_at' },
        { text: '', sortable: false, value: 'actions' },
      ];
    },
  },
};
</script>
