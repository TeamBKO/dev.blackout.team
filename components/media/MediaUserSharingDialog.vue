<template>
  <v-dialog v-model="open" :width="850" scrollable>
    <v-card :min-height="height">
      <v-toolbar :max-height="112">
        <v-toolbar-title>
          <span>Media ID: {{ mediaID }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon fab @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <template #extension>
          <v-text-field
            v-model="searchByUsername"
            filled
            label="Search by username"
            :prepend-inner-icon="'mdi-magnify'"
            :append-icon="'mdi-close'"
            @click:append="searchByUsername = ''"
          ></v-text-field>
        </template>
      </v-toolbar>

      <v-card-text>
        <v-subheader>Sharing</v-subheader>
        <v-list>
          <v-list-item v-for="(user, idx) in users" :key="idx">
            <v-list-item-avatar>
              <v-img :src="user.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                multiple
                v-model="computedSelected"
                :value="user.id"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <infinite-loading
          :identifier="identifier"
          @infinite="loadList"
          v-if="users && users.length"
        ></infinite-loading>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="share">Share</v-btn>
        <v-btn text color="error">Cancel</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
export default {
  name: 'MediaUserSharingList',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    height: {
      type: [Number, String],
      default: 1057,
    },
    width: {
      type: [Number, String],
      default: 850,
    },
  },

  mounted() {
    const onInputUpdate = debounce(this.onInputChange, 300);
    this.$watch('searchByUsername', async () => {
      if (!this.value) return;
      this.isSending = true;
      this.$nextTick(() => onInputUpdate());
    });
  },

  data() {
    return {
      isLoading: false,
      isSending: false,
      firstLoad: true,
      distance: 0,
      searchByUsername: '',
      mediaID: '',
      nextCursor: '',
      sharingNextCursor: '',
      prevCursor: '',
      users: [],
      currentlySelected: [],
      baseSelected: [],
      identifier: nanoid(),
    };
  },

  watch: {
    value(isOpen) {
      if (!isOpen) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.firstLoad = true;
            this.mediaID = '';
            this.nextCursor = '';
            this.sharingNextCursor = '';
            this.prevCursor = '';
            this.searchByUsername = '';
            this.users = [];
            this.currentlySelected = [];
            this.baseSelected = [];
            this.identifier = nanoid();
          }, 50);
        });
      }
    },
  },

  methods: {
    // onSearchInputChange(value) {
    //   this.searchByUsername = value;
    //   debounce(
    //     async () => {
    //       console.log('debounced');
    //       this.nextCursor = '';
    //       this.sharingNextCursor = '';
    //       this.prevCursor = '';
    //       this.users = [];
    //       this.firstLoad = true;
    //       this.identifier = nanoid();
    //       try {
    //         this.isSending = true;
    //         await this.loadList(null, this.mediaID);
    //       } finally {
    //         this.isSending = false;
    //       }
    //     },
    //     300,
    //     { trailing: true }
    //   )();
    // },

    async onInputChange(value) {
      this.nextCursor = '';
      this.prevCursor = '';
      this.sharingNextCursor = '';
      this.users = [];
      this.firstLoad = true;
      // this.identifier = nanoid();
      try {
        await this.loadList(null, this.mediaID);
      } finally {
        this.isSending = false;
      }
    },

    async share() {
      try {
        this.isSending = true;
        const params = {};

        if (this.toAdd.length) {
          Object.assign(params, { add: this.toAdd });
        }

        if (this.toRemove.length) {
          Object.assign(params, { remove: this.toRemove });
        }

        const result = await this.$axios.patch(
          `/media/share/${this.mediaID}`,
          params
        );

        this.baseSelected = [...this.currentlySelected];

        this.$toast.success('Changes saved.', {
          position: 'top-center',
          duration: 3000,
        });
      } catch (err) {
        console.log(err);
        this.currentlySelected = [...this.baseSelected];
        this.$toast.error(err.message, {
          position: 'top-center',
          duration: 3000,
        });
      } finally {
        this.isSending = false;
      }
    },

    async loadList($state, id) {
      if ($state && this.firstLoad) {
        console.log('invoking with first load');
        $state.loaded();
        this.firstLoad = false;
        return;
      }

      console.log('invoking');

      if (!this.mediaID && id) {
        this.mediaID = id;
      }

      const params = {};

      if (this.nextCursor) {
        Object.assign(params, { nextCursor: this.nextCursor });
      }

      if (this.sharingNextCursor) {
        Object.assign(params, { sharingNextCursor: this.sharingNextCursor });
      }

      if (this.prevCursor) {
        Object.assign(params, { prevCursor: this.prevCursor });
      }

      if (this.searchByUsername) {
        Object.assign(params, { searchBy: this.searchByUsername });
      }

      // const url = this.firstLoad ? `/media/share/${id}` : '/users';

      try {
        const { users, sharing } = (
          await this.$axios.get(`/media/share/${this.mediaID}`, { params })
        ).data;

        if (sharing.results && sharing.results.length) {
          if (sharing.pageInfo.next) {
            this.sharingNextCursor = sharing.pageInfo.next;
          }

          const selected = sharing.results.map(({ id }) => id);

          this.currentlySelected.push(...selected);
          // this.currentlySelected = selected;
          this.baseSelected = [...this.currentlySelected];
        }

        if (users && users.results && users.results.length) {
          this.users = this.firstLoad
            ? users.results
            : this.users.concat(users.results);
          if (users.pageInfo.next) {
            this.nextCursor = users.pageInfo.next;
          }
          if (users.pageInfo.prev) {
            this.prevCursor = users.pageInfo.prev;
          }
          if (users.pageInfo.hasMore) {
            if ($state) $state.loaded();
          } else {
            if ($state) $state.complete();
          }
        } else {
          if ($state) $state.complete();
        }
      } catch (err) {
        console.error(err);
        if ($state) $state.complete();
      }
    },
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

    toAdd() {
      return this.currentlySelected.filter(
        (selected) => !this.baseSelected.includes(selected)
      );
    },

    toRemove() {
      return this.baseSelected.filter(
        (selected) => !this.currentlySelected.includes(selected)
      );
    },

    computedSelected: {
      get() {
        return this.currentlySelected;
      },
      set(value) {
        this.currentlySelected = value;
        this.$emit('onChange', this.currentlySelected);
      },
    },
  },
};
</script>
