<template>
  <v-dialog v-model="open" fullscreen :hide-overlay="!open">
    <template #activator="{ on }" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-app-bar fixed clipped-left ref="top">
        <v-btn icon @click="openDrawer = !openDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer
        fixed
        clipped
        v-model="openDrawer"
        class="ranks__nav"
        hide-overlay
        :style="navStyle"
      >
        <v-tabs v-model="tab" vertical>
          <v-tab @click="setupDefaultRank" v-if="permissions.can_add_ranks">
            <v-icon left>mdi-plus-circle-outline</v-icon>
            <span>Add Rank</span>
          </v-tab>
          <v-tab
            v-for="rank in ranks"
            :key="rank.name"
            @click="getRank(rank.id)"
          >
            <img :src="rank.icon" v-if="rank.icon" />
            <span class="ml-3">{{ rank.name }}</span>
            <v-btn
              absolute
              icon
              right
              @click.stop="setRankForDeletion(rank)"
              v-if="rank.is_deletable && permissions.can_remove_ranks"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>
        <template #append>
          <div
            class="justify-center align-center py-2"
            v-if="hasMore"
            v-intersect.quiet="{
              options: { threshold: 1.0 },
              handler: onIntersect,
            }"
          >
            <v-progress-circular
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </template>
      </v-navigation-drawer>
      <v-card-text class="ranks" :style="cardStyle">
        <v-form v-model="valid">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center px-4">
                  <media-dialog
                    v-if="displayMediaDialog"
                    v-model="openMediaDialog"
                    v-bind="mediaOptions"
                    @setImage="selectedRank.icon = $event"
                  >
                    <template #activator="{ on }">
                      <v-badge
                        avatar
                        bordered
                        overlap
                        @click.native="openMediaDialog = true"
                      >
                        <template #badge>
                          <v-btn x-small icon>
                            <v-icon x-small>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <v-avatar size="40">
                          <img :src="selectedRank.icon" />
                        </v-avatar>
                      </v-badge>
                    </template>
                  </media-dialog>
                  <div class="d-flex flex-grow-1 ml-5">
                    <v-text-field
                      label="Name"
                      v-model="selectedRank.name"
                      :rules="[isRequired('Name')]"
                    ></v-text-field>
                  </div>
                </div>
                <!-- <v-list-item class="pa-0">
                  <v-list-item-avatar>
                    <media-dialog
                      v-if="displayMediaDialog"
                      v-model="openMediaDialog"
                      v-bind="mediaOptions"
                      @setImage="updateRoster"
                    >
                      <template #activator="{ on }">
                        <v-badge avatar bordered overlap v-on="on">
                          <template #badge>
                            <v-btn small icon>
                              <v-icon x-small>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <v-avatar size="40">
                            <v-img :src="selectedRank.icon"></v-img>
                          </v-avatar>
                        </v-badge>
                      </template>
                    </media-dialog>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-text-field
                      label="Name"
                      v-model="selectedRank.name"
                      :rules="[isRequired('Name')]"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item> -->
              </v-col>
            </v-row>
            <roster-permissions
              v-model="selectedRank.permissions"
              :permissions="permissions"
              @change="selectedPermissions = $event"
            ></roster-permissions>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="save">Save</v-btn>
        <v-btn text @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="openRemovalDialog"
      max-width="500px"
      max-height="250px"
      v-if="itemToRemove"
    >
      <v-card>
        <v-card-title>
          <v-icon left>mdi-alert</v-icon>
          <span>Remove: {{ itemToRemove.name }}?</span>
        </v-card-title>
        <v-card-text>
          <p>
            Removing this item is irrevesible and will propergate chances
            throughout your roster.
          </p>
          <strong>Do you wish to continue?</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="removeRank">Confirm</v-btn>
          <v-btn @click="cancelDeletion">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import mediaPermissions from '~/mixins/mediaPermissions.js';
import RANKS from '~/constants/rosters/ranks/public.js';
import RosterPermissions from './RosterPermissions.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';
import { isRequired } from '~/utilities/validators';

const defaultPermissions = {
  id: null,
  can_add_members: false,
  can_edit_members: false,
  can_edit_members_rank: false,
  can_remove_members: false,
  can_add_ranks: false,
  can_edit_ranks: false,
  can_remove_ranks: false,
  can_edit_roster_details: false,
  can_delete_roster: false,
};
export default {
  name: 'RosterRanksDialog',

  mixins: [mediaPermissions],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: Object,
      default: () => {},
      required: true,
    },
    priority: {
      type: Number,
    },
    title: {
      type: String,
      default: 'Manage Ranks',
    },
    id: {
      type: String,
    },
  },

  components: { RosterPermissions, MediaDialog },

  watch: {
    async open(v) {
      if (v) {
        if (this.ranks && !this.ranks.length) {
          try {
            await this.$store.dispatch(RANKS.actions.FETCH, {
              url: `/rosters/${this.id}/ranks`,
            });
          } catch (err) {
            this.$toast.error(err.response.data.message, {
              position: 'top-center',
            });
          }
        }
      } else {
        requestAnimationFrame(() => {
          this.$nextTick(() => {
            this.setupDefaultRank();
            this.tab = 0;
          });
        });
      }
    },
  },

  data() {
    return {
      mediaOptions: {
        fileSize: 120000,
        single: true,
        fullscreen: true,
      },
      tab: 0,
      valid: false,
      open: false,
      openDrawer: true,
      openRemovalDialog: false,
      openMediaDialog: false,
      itemToRemove: null,
      selectedRank: {
        id: null,
        name: '',
        icon: '',
        permissions: {
          id: null,
          can_add_members: false,
          can_edit_members: false,
          can_edit_members_rank: false,
          can_remove_members: false,
          can_add_ranks: false,
          can_edit_ranks: false,
          can_remove_ranks: false,
          can_edit_roster_details: false,
          can_delete_roster: false,
        },
      },

      selectedPermissions: null,
    };
  },

  methods: {
    isRequired,
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.ranks.length && this.hasMore) {
        await this.$store.dispatch(RANKS.actions.FETCH, {
          url: `/rosters/${this.$route.params.id}/ranks`,
        });
      }
    },

    setupDefaultRank() {
      this.selectedRank.id = null;
      this.selectedRank.name = '';
      this.selectedRank.icon = '';
      this.selectedRank.permissions = { ...defaultPermissions };
    },

    setRankForDeletion(rank) {
      this.itemToRemove = rank;
      this.openRemovalDialog = true;
    },

    cancelDeletion() {
      this.openRemovalDialog = false;
      this.$nextTick(() => {
        this.itemToRemove = false;
      });
    },

    reset() {},

    async save() {
      const data = {};
      const permissions = { ...this.selectedPermissions };

      if (this.selectedRank.name) {
        Object.assign(data, { name: this.selectedRank.name });
      }

      if (this.selectedRank.icon) {
        Object.assign(data, { icon: this.selectedRank.icon });
      }

      if (this.selectedRank.permissions.id) {
        Object.assign(permissions, { id: this.selectedRank.permissions.id });
      }

      Object.assign(data, { permissions });

      if (!this.selectedRank.id) {
        Object.assign(data, { roster_id: this.id });
        this.$store.dispatch(RANKS.actions.ADD_ITEM, data);
        return;
      }

      let rank = await this.$store.dispatch(RANKS.actions.UPDATE_ITEM, {
        id: this.selectedRank.id,
        payload: data,
      });

      this.$emit(
        'onUpdate',
        Object.assign(rank, { permissions: this.selectedPermissions })
      );
    },

    async removeRank() {
      try {
        const item = await this.$store.dispatch(
          RANKS.actions.REMOVE_ITEM,
          this.itemToRemove.id
        );
        if (this.tab > 0 && this.tab === idx - 1) {
          this.tab = 0;
          this.setupDefaultRank();
        }

        this.openRemovalDialog = false;
        this.itemToRemove = null;

        this.$toast.success(`Removed rank: ${item.name}`, {
          position: 'top-center',
        });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, {
          position: 'top-center',
        });
      }
    },

    async getRank(id) {
      try {
        const rank = await this.$axios.$get(`/rosters/rank/${id}`);

        if (rank) {
          this.selectedRank = rank;
        }
      } catch (err) {}
    },
  },

  computed: {
    cardStyle() {
      return {
        padding: `64px 0 0 ${
          this.openDrawer && !this.$vuetify.breakpoint.mobile ? '256px' : '0px'
        }`,
      };
    },

    navStyle() {
      return { top: !this.$vuetify.breakpoint.smAndDown ? '64px' : '56px' };
    },

    top() {
      return { top: this.$refs.top.$el.style.height };
    },

    ranks() {
      return this.$store.getters[RANKS.getters.ITEMS].filter(
        ({ priority }) => priority >= this.priority
      );
    },

    hasMore() {
      return this.$store.getters[RANKS.getters.HAS_MORE];
    },

    loading() {
      return this.$store.getters[RANKS.getters.LOADING];
    },
  },
};
</script>

<style>
.ranks {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ranks__nav {
  background-color: #1e1e1e !important;
}
</style>
