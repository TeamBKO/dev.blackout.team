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
            <v-btn text @click="openRosterDialog = true" v-if="canAddAll">
              <v-icon left>mdi-plus</v-icon>
              <span>Add Roster</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            id="rosters"
            show-select
            class="elevation-1"
            v-model="selectedItems"
            hide-default-footer
            disable-pagination
            :items="rosters"
            :headers="headers"
            :item-key="'id'"
          >
            <template #item.name="{ item }" v-if="canUpdateAll">
              <table-field
                validate
                :endpoint="'rosterName'"
                :value="item.name"
                @save="updateRoster(item.id, 'name', $event)"
              />
            </template>
            <template #item.creator="{ item }">
              <v-list-item class="px-0">
                <v-list-item-avatar>
                  <user-avatar :item="item.creator" :size="40" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.creator.username }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template #item.form="{ item }" v-if="canUpdateAll">
              <span @focus="getForms" v-if="showField === false">{{
                item.form.name
              }}</span>
              <table-field
                v-else
                :items="forms"
                :value="item.form.id"
                :itemText="'name'"
                @save="updateRoster(item.id, 'roster_form', $event)"
              >
                <template #select="{ items, value }">
                  <v-autocomplete :value="value" :items="items">
                    <template #append-item>
                      <div v-intersect="endInteract"></div>
                    </template>
                  </v-autocomplete>
                </template>
              </table-field>
            </template>
            <template #item.enable_recruitment="{ item }" v-if="canUpdateAll">
              <v-switch
                :input-value="item.enable_recruitment"
                @change="updateRoster(item.id, 'enable_recruitment', $event)"
              ></v-switch>
            </template>
            <template #item.apply_roles_on_approval="{ item }">
              <v-switch
                :input-value="item.apply_roles_on_approval"
                @change="
                  updateRoster(item.id, 'apply_roles_on_approval', $event)
                "
              ></v-switch>
            </template>
            <template #item.private="{ item }">
              <v-switch
                :input-value="item.private"
                @change="updateRoster(item.id, 'private', $event)"
              ></v-switch>
            </template>
            <template #item.is_disabled="{ item }">
              <v-switch
                :input-value="item.is_disabled"
                @change="updateRoster(item.id, 'is_disabled', $event)"
              ></v-switch>
            </template>
            <template #item.actions="{ item }">
              <table-actions
                @view="$router.push(`/admin/rosters/${item.id}`)"
                @edit="$refs.rosterDialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="tableActionSuffix"
              ></table-actions>
            </template>
          </v-data-table>
          <div
            class="d-flex justify-center align-center"
            v-intersect="onIntersect"
            v-if="rosters.length && hasMore"
          >
            <v-progress-circular
              intermediate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <roster-dialog
      ref="rosterDialog"
      v-model="openRosterDialog"
    ></roster-dialog>
  </section>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js';

import itemManagement from '~/mixins/itemManagement.js';
import filters from '~/mixins/filters.js';
import filterByInput from '~/mixins/filterByInput.js';

import ROSTERS from '~/constants/rosters/public.js';
import FORMS from '~/constants/forms/public.js';

import UserAvatar from '~/components/avatar/ListAvatar.vue';
import TableField from '~/components/controls/TableField.vue';
import TableActions from '~/components/controls/Actions.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';
import RosterDialog from '~/components/rosters/RosterDialog.vue';

export default {
  name: 'RostersTable',
  layout: 'admin',

  middleware: [
    'auth',
    ({ $auth, $permissions, store, redirect, params }) => {
      const { VIEW_ALL_ADMIN } = $permissions;
      if ($auth.loggedIn) {
        if (!$auth.hasScope(VIEW_ALL_ADMIN)) {
          redirect('/');
        }
        if (!store.getters[ROSTERS.getters.ITEMS].length) {
          store.dispatch(ROSTERS.actions.FETCH);
        }
      } else {
        redirect('/');
      }
    },
    setTitle('View Rosters'),
  ],

  components: {
    TableField,
    TableActions,
    DeleteDialog,
    RosterDialog,
    UserAvatar,
  },

  mixins: [
    itemManagement(ROSTERS),
    filters(ROSTERS),
    filterByInput(ROSTERS, 'searchByName'),
  ],

  // async asyncData(ctx) {
  //   try {
  //     ctx.store.dispatch(ROSTERS.actions.FETCH);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  data() {
    return {
      showFormField: false,
      openFilterSideMenu: false,
      openDeleteDialog: false,
      openRosterDialog: false,
      nextCursor: '',
      identifier: '',

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

      tableActionSuffix: 'users',
    };
  },

  methods: {
    updateRoster(id, name, value) {
      const payload = { [name]: value };
      this.$store.dispatch(ROSTERS.actions.UPDATE_ITEM, { id, payload });
    },
    getForms() {
      this.showFormField = true;
    },

    async endIntersect(entries, observer, isIntersecting) {
      if (this.hasMore && this.rosters.length) {
        if (isIntersecting) {
          console.log('intersecting');
          this.$store.dispatch(ROSTERS.actions.FETCH, { loading: true });
        }
      }
    },

    endIntersectForms(entries, observer, isIntersecting) {
      if (isIntersecting && this.forms.length) {
        this.$store.dispatch(FORMS.actions.FETCH, { loading: true });
      }
    },
  },

  computed: {
    canUpdateAll() {
      return this.$auth.hasScope(this.$permissions.VIEW_ALL_ADMIN);
    },

    canAddAll() {
      return this.$auth.hasScope(this.$permissions.VIEW_ALL_ADMIN);
    },

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
      return this.$store.getters[FORMS.getters.ITEMS];
    },

    rosters() {
      return this.$store.getters[ROSTERS.getters.ITEMS];
    },

    hasMore() {
      return this.$store.getters[ROSTERS.getters.HAS_MORE];
    },

    headers() {
      return [
        {
          text: 'NAME',
          sortable: false,
          value: 'name',
        },
        {
          text: 'ICON',
          sortable: false,
          value: 'icon',
        },
        {
          text: 'FORM',
          sortable: false,
          value: this.showFormField ? 'roster_form.id' : 'roster_form.name',
        },
        {
          text: 'CREATOR',
          sortable: false,
          value: 'creator',
        },
        {
          text: 'ENABLE RECRUITMENT',
          sortable: false,
          value: 'enable_recruitment',
        },
        {
          text: 'ROLES ON APPROVAL',
          sortable: false,
          value: 'apply_roles_on_approval',
        },
        {
          text: 'PRIVATE',
          sortable: false,
          value: 'private',
        },
        {
          text: 'DISABLED',
          sortable: false,
          value: 'is_disabled',
        },
        { text: 'CREATED AT', sortable: false, value: 'created_at' },
        { text: 'UPDATED AT', sortable: false, value: 'updated_at' },
        { text: '', sortable: false, value: 'actions' },
      ];
    },
  },
};
</script>
