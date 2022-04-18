<template>
  <v-container fluid>
    <v-row>
      <v-col md="6" sm="12">
        <v-text-field
          v-model="searchByName"
          filled
          :label="'Search by form name'"
          :prepend-inner-icon="'mdi-magnify'"
          :append-icon="'mdi-close'"
          @click:append="searchByName = ''"
        ></v-text-field>
      </v-col>
      <v-col md="6" sm="12">
        <v-spacer />
        <div class="d-flex align-center">
          <v-spacer></v-spacer>
          <v-btn text @click="openFilters">
            <v-icon left>mdi-filter-variant</v-icon>
            <span>Filters</span>
          </v-btn>
          <delete-dialog
            v-model="open"
            v-if="canDeleteAll"
            :length="selectedItems.length"
            :single="single"
            @deleteAll="onDelete"
            @cancel="onCancel"
          ></delete-dialog>
          <form-dialog ref="dialog" v-if="hasPermissions"></form-dialog>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          class="elevation-1"
          show-select
          v-model="selectedItems"
          hide-default-footer
          disable-pagination
          :items="forms"
          :headers="headers"
          :item-key="'id'"
        >
          <template #item.name="{ item }" v-if="canUpdateAll">
            <table-field
              :endpoint="'formName'"
              :value="item.name"
              @save="updateFormTemplate(item.id, 'name', $event)"
            ></table-field>
          </template>
          <template #item.created_by="{ item }" v-if="canUpdateAll">
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <user-avatar :item="item.created_by" :size="40" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.created_by.username }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template #item.actions="{ item }" v-if="displayActions">
            <div class="text-right">
              <table-actions
                @edit="$refs.dialog.setEditableContent(item.id)"
                @remove="setItemForRemoval(item.id)"
                :actions="actions"
                :suffix="name"
                :isDeletable="item.is_deletable"
              ></table-actions>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <div
        class="d-flex justify-center align-center py-2"
        v-intersect.quiet="{
          options: { threshold: 1.0 },
          handler: onIntersect,
        }"
        v-if="forms.length && hasMore"
      >
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
      </div>
    </v-row>
    <filter-side-menu
      v-model="openFilterSideMenu"
      show-search
      @update="onFilterUpdate"
      @reset="onFilterReset"
      :search.sync="searchByName"
      :namespace="'forms'"
      :items="filters"
      :panelHeaders="panelHeaders"
    ></filter-side-menu>
  </v-container>
</template>

<script>
import FORMS from '~/constants/forms/public.js';
import ROSTERS from '~/constants/rosters/public.js';

import filters from '~/mixins/filters.js';
import itemManagement from '~/mixins/itemManagement.js';
import clearPage from '~/mixins/clearPage.js';
import filterByInput from '~/mixins/filterByInput';

import setPageTitle from '~/middleware/setPageTitle.js';

import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';
import FilterSideMenu from '~/components/filters/FilterSideMenu.vue';
import FormDialog from '~/components/form/FormDialog2.vue';
import TableActions from '~/components/controls/Actions.vue';
import TableField from '~/components/controls/TableField.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';

export default {
  name: 'FormTemplates',
  layout: 'admin',

  mixins: [
    filters(FORMS, 'forms'),
    filterByInput(FORMS, 'searchByName'),
    itemManagement(FORMS),
    // clearPage(FORMS),
  ],

  components: {
    FormDialog,
    DeleteDialog,
    FilterSideMenu,
    TableActions,
    TableField,
    UserAvatar,
  },

  middleware: [
    'auth',
    setPageTitle('View Templates'),
    ({ $auth, $permissions, store, redirect }) => {
      const perms = [$permissions.VIEW_ALL_ADMIN, $permissions.VIEW_ALL_FORMS];
      if ($auth.loggedIn) {
        if (!$auth.hasScope(perms)) {
          return redirect('/');
        }
        if (!store.getters[FORMS.getters.ITEMS].length) {
          store.dispatch(FORMS.actions.FETCH);
        }
      } else {
        redirect('/');
      }
      // else store.dispatch(forms.actions.FETCH, true);
    },
  ],

  data() {
    return {
      panelHeaders: ['Categories', 'Status'],
      openFilterSideMenu: false,

      icon: 'mdi-trash-can-outline',
      name: 'forms',
      open: false,

      actions: [
        {
          icon: 'mdi-eye',
          scope: [
            [this.$permissions.VIEW_OWN_FORMS],
            [this.$permissions.VIEW_ALL_FORMS],
          ],
          text: 'View',
        },
        {
          icon: 'mdi-pencil',
          scope: [
            [this.$permissions.UPDATE_ALL_FORMS],
            [this.$permissions.UPDATE_OWN_FORMS],
          ],
          text: 'Edit',
        },
        {
          icon: 'mdi-delete',
          scope: [
            [this.$permissions.REMOVE_ALL_FORMS],
            [this.$permissions.REMOVE_OWN_FORMS],
          ],
          text: 'Remove',
        },
      ],
    };
  },

  methods: {
    openFilters() {
      this.$store.dispatch(ROSTERS.actions.FETCH);
      this.openFilterSideMenu = true;
    },

    fetchMoreRosters() {
      this.$store.dispatch(ROSTER.actions.FETCH);
    },

    updateFormTemplate(id, name, value) {
      const details = { [name]: value };
      this.$store.dispatch(
        FORMS.actions.UPDATE_ITEM,
        Object.assign({}, { id, details })
      );
    },

    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting && this.forms.length) {
        this.$store.dispatch(FORMS.actions.FETCH, { loading: true });
      }
    },
  },

  computed: {
    hasMore() {
      return this.$store.getters[FORMS.getters.HAS_MORE];
    },

    loading() {
      return this.$store.getters[FORMS.getters.LOADING];
    },

    headers() {
      return [
        { text: 'NAME', align: 'start', value: 'name' },
        { text: 'CREATOR', align: 'start', value: 'created_by' },
        { text: 'CREATED AT', sortable: true, value: 'created_at' },
        { text: 'UPDATED AT', sortable: true, value: 'updated_at' },
        {
          text: this.$vuetify.breakpoint.mobile ? 'ACTIONS' : '',
          align: 'end',
          value: 'actions',
        },
      ];
    },

    forms() {
      return this.$store.getters[FORMS.getters.ITEMS];
    },

    rosters() {
      return this.$store.getters[ROSTERS.getters.ITEMS];
    },

    canUpdateAll() {
      return this.$auth.hasScope(this.$permissions.UPDATE_ALL_FORMS);
    },

    canAddAll() {
      return this.$auth.hasScope(this.$permissions.ADD_ALL_FORMS);
    },

    canDeleteAll() {
      return this.$auth.hasScope(this.$permissions.DELETE_ALL_FORMS);
    },

    displayActions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_ROLES],
        [this.$permissions.UPDATE_ALL_ROLES],
        [this.$permissions.DELETE_ALL_ROLES],
      ]);
    },

    hasPermissions() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_FORMS],
        [this.$permissions.UPDATE_ALL_FORMS],
        [this.$permissions.UPDATE_OWN_FORMS],
      ]);
    },

    filters() {
      return [
        {
          name: 'Rosters',
          filterBy: 'rosters.id',
          list: this.rosters,
          multiple: true,
        },
      ];
    },

    // filters() {
    //   return [
    //     {
    //       name: 'Categories',
    //       filterBy: 'category_id',
    //       list: this.categories,
    //       multiple: true,
    //     },
    //     {
    //       name: 'Status',
    //       filterBy: 'status',
    //       list: [
    //         { name: 'Enabled', value: true },
    //         { name: 'Disabled', value: false },
    //       ],
    //     },
    //   ];
    // },
  },
};
</script>
