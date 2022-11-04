<template>
  <v-row>
    <v-col cols="12" md="6">
      <delete-dialog
        @delete="onDelete"
        @cancel="onCancel"
        :single="selected.length === 1"
        :length="selected.length"
      >
        <template #activator="{ on }">
          <v-btn v-on="on" :disabled="!selected.length"
            >Delete ({{ selected.length }})</v-btn
          >
        </template>
      </delete-dialog>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selected"
        disable-pagination
        hide-default-footer
        show-select
        :headers="headers"
        :items="items"
      >
        <template #item.roster="{ item }">
          <v-list-item class="px-0">
            <v-list-item-avatar>
              <v-avatar size="42">
                <v-img :src="item.roster.icon"></v-img>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ item.roster.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template #item.form="{ item }">
          {{ item.form.name }}
        </template>
        <template #item.status="{ item }">
          <v-icon left>{{
            item.status === 'approved'
              ? 'mdi-check'
              : item.status === 'pending'
              ? 'mdi-clock-time-three-outline'
              : 'mdi-close'
          }}</v-icon>
          <strong>{{ item.status.toUpperCase() }}</strong>
        </template>
        <template #item.created_at="{ item }">
          {{ $dayjs(item.created_at).format('ddd, MMM D, YYYY') }}
        </template>
        <template #item.updated_at="{ item }">
          {{ $dayjs(item.updated_at).format('ddd, MMM D, YYYY') }}
        </template>
        <template #item.actions="{ item }">
          <div class="text-right">
            <table-actions>
              <template #action.view>
                <roster-member-form-dialog
                  v-if="item.form"
                  readOnly
                  :formID="item.id"
                  :rosterID="item.roster.id"
                  :member="item"
                >
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-list-item-subtitle> View </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </template>
                </roster-member-form-dialog>
              </template>
              <template #action.edit>
                <roster-member-form-dialog
                  v-if="item.form"
                  :rosterID="item.roster.id"
                  :formID="item.id"
                  :member="item"
                >
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-list-item-subtitle> Edit </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </template>
                </roster-member-form-dialog>
              </template>
              <template #action.remove>
                <delete-dialog
                  :item="item"
                  :title="`Delete Member Form`"
                  @delete="onDelete"
                >
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-content>
                        <v-list-item-subtitle> Remove </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </template>
                </delete-dialog>
              </template>
            </table-actions>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import cursorPagination from '~/mixins/cursorPagination.js';
import TableActions from '~/components/controls/Actions.vue';
import RosterMemberFormDialog from '~/components/rosters/RosterMemberFormDialog.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog2.vue';
export default {
  name: 'RosterMyApplications',

  mixins: [cursorPagination('/rosters/member/forms')],

  components: { TableActions, RosterMemberFormDialog, DeleteDialog },

  props: {
    isTabActive: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    isTabActive: {
      immediate: true,
      handler: async function (v) {
        if (v && !this.items.length) {
          await this.fetchItems();
        }
      },
    },
  },

  data() {
    return {
      showDeleteDialog: false,
      selected: [],
    };
  },

  methods: {
    onCancel() {
      this.selected = [];
    },
    async onDelete(id) {
      let request = this.$axios.$delete(`/rosters/member/forms/${id}`);

      if (!id && this.selected.length) {
        let params = { ids: this.selected.map(({ id }) => id) };
        request = this.$axios.$delete(`/rosters/member/forms`, { params });
      }

      try {
        const deleted = await request;

        this.$toast.success(`Deleted ${deleted.length} number of items.`, {
          position: 'top-center',
        });

        this.items = this.items.filter(({ id }) => !deleted.includes(id));
      } catch (err) {
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      } finally {
        this.selected = [];
      }
    },
    upperCase(item) {
      item.text = item.text.toUpperCase();
      return item;
    },
  },

  computed: {
    headers() {
      const headers = [
        {
          text: 'Roster',
          sortable: true,
          value: 'roster',
        },
        { text: 'Form Name', sortable: true, value: 'form' },
        {
          text: 'Status',
          sortable: true,
          value: 'status',
        },
        {
          text: 'created at',
          sortable: false,
          value: 'created_at',
        },
        {
          text: 'Updated At',
          sortable: false,
          value: 'updated_at',
        },
        {
          text: '',
          sortable: false,
          value: 'actions',
        },
      ];

      return headers.map(this.upperCase);
    },
  },
};
</script>
