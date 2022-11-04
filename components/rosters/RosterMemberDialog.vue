<template>
  <v-dialog v-model="computedOpen" max-width="900">
    <template #activator="items" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="items" />
    </template>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <span>Edit:</span>
          <user-avatar class="mx-2" :item="{ username, avatar }" :size="40" />
          <span>{{ username }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              v-if="
                permissions.can_edit_member_ranks &&
                member.rank &&
                priority <= member.rank.priority
              "
            >
              <roster-rank-selector
                v-model="selectedRank"
                :id="rosterID"
                :priority="priority"
              ></roster-rank-selector>
            </v-col>

            <v-col cols="12">
              <roster-permissions
                v-model="member.permissions"
                :permissions="permissions"
                @change="selectedPermissions = $event"
              ></roster-permissions>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="coral" @click="save">Save</v-btn>
        <v-btn text @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const defaultMember = {
  id: null,
  rank: null,
  permissions: {
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
};
import RANKS from '~/constants/rosters/ranks/public.js';
import RosterPermissions from '~/components/rosters/RosterPermissions.vue';
import RosterRankSelector from '~/components/rosters/RosterRankSelector.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
export default {
  name: 'RosterMemberDialog',

  components: { RosterPermissions, RosterRankSelector, UserAvatar },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: Object,
      default: () => {},
    },
    rosterID: {
      type: String,
    },
    priority: {
      type: Number,
    },
  },

  watch: {
    open(v) {
      if (!v) {
        this.username = '';
        this.avatar = null;
        this.member = { ...defaultMember };
        this.selectedRank = '';
        this.selectedRank = null;
      }
    },
  },

  data() {
    return {
      open: false,
      username: '',
      avatar: null,
      member: {
        id: null,
        rank: null,
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
      selectedRank: '',
    };
  },

  methods: {
    filterPermissions(permissions) {
      return Object.entries(permissions).reduce((obj, [key, val]) => {
        if (this.member.permissions[key] === undefined) return obj;
        obj[key] = val;
        return obj;
      }, {});
    },
    reset() {
      this.selectedPermissions = { ...this.member.permissions };
      this.selectedRank = this.member.rank.id;
    },
    async save() {
      const member = { id: this.member.id };
      const isDiff = Object.keys(this.selectedPermissions).some((key) => {
        return this.selectedPermissions[key] !== this.member.permissions[key];
      });

      if (isDiff) {
        Object.assign(member, {
          permissions: {
            id: this.member.permissions.id,
            ...Object.keys(this.selectedPermissions).reduce((obj, key) => {
              const match =
                this.selectedPermissions[key] === this.member.permissions[key];

              if (match) return obj;
              obj[key] = this.selectedPermissions[key];
              return obj;
            }, {}),
          },
        });
      }

      if (this.selectedRank !== this.member.rank.id) {
        Object.assign(member, {
          roster_rank_id: this.selectedRank,
          previous_rank: this.member.rank,
        });
      }

      const url = `/rosters/${this.rosterID}/members/${this.member.id}`;

      try {
        const data = await this.$axios.$patch(url, member);

        if (data.rank) {
          this.member.rank.id = data.id;
        }

        if (data.permissions) {
          this.member.permissions = Object.assign(
            this.member.permissions,
            this.filterPermissions(data.permissions)
          );
        }

        if (!data.rank) {
          this.$toast.success('Saved changes.', {
            position: 'top-center',
            duration: 3000,
          });
        }
      } catch (err) {
        console.log(err);
      }

      // this.$emit('save', member);
    },
    async getMember(id) {
      const params = {};

      if (!this.ranks?.length) {
        this.$store.dispatch(RANKS.actions.FETCH, {
          url: `/rosters/${this.id}/ranks`,
          loading: false,
        });
        // Object.assign(params, {
        //   getRanks: true,
        //   roster_id: this.id,
        // });
      }

      try {
        const { member, ranks } = await this.$axios.$get(
          `/rosters/member/${id}`,
          {
            params,
          }
        );

        if (member) {
          const { username, avatar, ...m } = member;
          this.username = username;
          this.avatar = avatar;
          this.member = m;
        }

        this.selectedRank = this.member.rank.id;

        if (ranks?.results?.length) {
          this.$store.commit(RANKS.mutations.SET_ITEMS, ranks.results);
          if (ranks?.pageInfo?.next) {
            this.$store.commit(RANKS.mutations.SET_PARAM, {
              param: 'nextCursor',
              value: ranks.pageInfo.next,
            });
          }
          if (ranks?.pageInfo?.previous) {
            this.$store.commit(RANKS.mutations.SET_PARAM, {
              param: 'prevCursor',
              value: ranks.pageInfo.previous,
            });
          }

          if (ranks?.pageInfo?.hasMore) {
            this.$store.commit(
              RANKS.mutations.SET_HAS_MORE,
              ranks.pageInfo.hasMore
            );
          }
        }
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }

      this.open = true;
    },
  },

  computed: {
    computedOpen: {
      get() {
        return this.value || this.open;
      },
      set(value) {
        this.open = true;
        this.$emit('input', value);
      },
    },

    ranks() {
      return this.$store.getters[RANKS.getters.ITEMS];
    },
  },
};
</script>
