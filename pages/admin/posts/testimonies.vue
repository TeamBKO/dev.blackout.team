<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6"></v-col>
      <v-col cols="12" md="6"> </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <post-table
          v-model="selected"
          :items="testimonies"
          :headers="headers"
          :enable-drag="canDrag"
        >
          <template #item.author="{ item }">
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <user-avatar :nameKey="'author'" :item="item" :size="40" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.author }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template #item.actions="{ item, index }">
            <table-actions
              :actions="actions"
              :suffix="suffix"
              @edit="onEdit(item, index)"
            ></table-actions>
          </template>
        </post-table>
        <div
          class="d-flex justify-center align-center"
          v-intersect="onIntersect"
          v-if="testimonies.length && hasMore"
        >
          <v-progress-circular
            indeterminate
            v-if="loading"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>

    <media-dialog
      v-model="mediaDialog"
      single
      header
      fullscreen
      :title="'Select an image'"
      :fileSize="fileSize"
      @setImage="setImage"
    ></media-dialog>
  </v-container>
</template>

<script>
import setPageTitle from '~/middleware/setPageTitle.js';
import PostTable from '~/components/frontpage/PostTable.vue';
import TableActions from '~/components/controls/Actions.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';

export default {
  name: 'Testimonies',
  layout: 'admin',

  components: { MediaDialog, PostTable, UserAvatar, TableActions },

  middleware: [
    'auth',
    setPageTitle('Testimonies'),
    ({ $auth, $permissions, store, redirect }) => {
      if (!$auth.hasScope($permissions.VIEW_ALL_ADMIN)) {
        return redirect('/');
        //   } else {
        //     store.dispatch(lists.actions.FETCH, 'categories');
      }
    },
  ],

  data() {
    return {
      testimonyDialog: false,
      mediaDialog: false,

      canDrag: false,
      hasMore: true,
      loading: false,

      selectedTestimoney: null,
      nextCursor: '',
      prevCursor: '',

      suffix: 'admin',
      fileSize: 72000,
      minWidth: 500,
      selected: [],
      actions: [
        { icon: 'mdi-pencil', scope: 'view', text: 'Edit' },
        { icon: 'mdi-delete', scope: 'view', text: 'Remove' },
      ],
      headers: [
        { text: 'ID', sortable: false, value: 'id' },
        { text: 'AUTHOR', sortable: false, value: 'author' },
        { text: 'TEXT', sortable: false, value: 'text' },
        { text: '', sortable: false, value: 'actions' },
      ],

      testimonies: [],
    };
  },

  methods: {
    setImage(image) {
      this.details.avatar = image;
    },
    onSuccess(item) {
      if (this.selectedTestimoney) {
        this.selectedTestimony = null;
      }
      const idx = this.testimonies.findIndex(({ id }) => id === item.id);
      if (idx !== -1) {
        this.testimonies.splice(idx, 1, item);
      }
    },

    onEdit(item, index) {
      this.selectedTestimoney = {
        order: index,
        id: item.id,
        avatar: item.avatar,
        author: item.author,
        text: item.text,
      };
      this.testimonyDialog = true;
    },

    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.testimonies.length && this.hasMore) {
        this.onUpdate();
      }
    },

    async onUpdate() {
      const params = {};
      if (!this.hasMore) return;

      if (this.nextCursor) {
        Object.assign(params, { nextCursor: this.nextCursor });
      }

      try {
        const items = await this.$axios.$get('/testimonies', { params });
        if (items && item.results && item.results.length) {
          if (item.pageInfo.next) {
            this.nextCursor = item.pageInfo.next;
          }
          if (item.pageInfo.prev) {
            this.prevCursor = item.pageInfo.prev;
          }
          if (item.pageInfo.hasOwnProperty('hasMore')) {
            this.hasMore = item.pageInfo.hasMore;
          }
          this.testimonies = this.testimonies.concat(item.results);
        } else {
          this.hasMore = false;
        }
      } catch (err) {}
    },

    // async saveOrderChange() {
    //   await this.$axios.patch('/testimony/order', this.testimonyOrder);
    //   this.$store.dispatch(snackbar.actions.TOGGLE_BAR, {
    //     text: 'Updates saved.',
    //     position: 'top',
    //   });
    // },
  },
};
</script>
