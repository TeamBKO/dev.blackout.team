<template>
  <v-container fluid class="pa-0">
    <v-toolbar :height="300" extended>
      <template #img>
        <v-img :src="rosterInfo.banner" eager :max-height="300">
          <v-container fill-height class="banner">
            <div class="d-flex align-center">
              <v-avatar size="96">
                <img :src="rosterInfo.icon" />
              </v-avatar>
              <span class="text-md-h3 text sm-and-down h5 text-shadow ml-3">{{
                rosterInfo.name
              }}</span>
            </div>
          </v-container>
        </v-img>
      </template>
      <template #extension>
        <v-container>
          <v-tabs v-model="tab" @change="onChange">
            <v-tab v-for="tab in computedTabs" :key="tab.name">
              {{ tab.name }}
            </v-tab>
            <v-spacer></v-spacer>
            <roster-ranks-dialog
              v-if="hasPermissionsForRanks"
              :permissions="permissions"
              :id="rosterInfo.id"
              :priority="currentMember.rank.priority"
              @onUpdate="updateCurrentMember"
            >
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  <v-icon left>mdi-chevron-triple-up</v-icon>
                  <span>Manage Ranks</span>
                </div>
              </template>
            </roster-ranks-dialog>
            <roster-dialog
              v-if="permissions.can_edit_roster_details"
              v-model="openSettings"
              ref="settings"
              @onUpdate="setRosterData"
              :title="'Roster Settings'"
            >
              <template #activator="{ on }">
                <div
                  class="v-tab"
                  @click="
                    $refs.settings.setEditableContent(
                      rosterInfo.id,
                      rosterInfo,
                      false
                    )
                  "
                >
                  <v-icon left>mdi-cog-outline</v-icon>
                  <span>Settings</span>
                </div>
              </template>
            </roster-dialog>
            <roster-actions
              v-if="permissions.can_edit_members"
              :permissions="permissions"
              :isApplicantTab="isApplicantTab"
              :isMemberTab="isMemberTab"
              :isRejectedTab="isRejectedTab"
              @approved="updateMemberStatus(null, $event)"
              @rejected="updateMemberStatus(null, $event)"
            >
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  actions
                  <v-icon small>mdi-chevron-down</v-icon>
                </div>
              </template>
              <template #action.removed>
                <v-list-item
                  :disabled="!selected.length"
                  @click="openDeleteDialog = true"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account-remove-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Remove</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template #bottom v-if="permissions.can_delete_roster">
                <v-list-item @click="deleteRoster">
                  <v-list-item-icon>
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Delete Roster</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </roster-actions>
          </v-tabs>
        </v-container>
      </template>
    </v-toolbar>

    <v-container>
      <slot name="prepend" />
      <v-row v-if="!hideBreadcrumbs">
        <v-col cols="12">
          <bread-crumbs></bread-crumbs>
        </v-col>
      </v-row>
      <v-sheet class="mb-14" rounded elevation="2">
        <v-row>
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              disable-pagination
              :show-select="hasPermissionsForActions"
              hide-default-footer
              :items="members[currentTab].items"
              :headers="headers[currentTab]"
            >
              <template #item.username="{ item }">
                <v-list-item class="px-0">
                  <v-list-item-avatar>
                    <user-avatar :item="item" :size="40" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.username }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template #item.rank="{ item }">
                <roster-rank-field
                  v-if="permissions.can_edit_member_ranks"
                  :value="item.rank"
                  :id="rosterInfo.id"
                  :priority="currentMember.rank.priority"
                  @save="updateMemberRank(item.id, item.userID, $event)"
                ></roster-rank-field>
                <v-list-item class="px-0" v-else>
                  <v-list-item-icon class="mr-3">
                    <v-img :src="item.rank.icon" :size="42"></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ item.rank.name }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template #item.approved_on="{ item }">
                {{ $dayjs(item.approved_on).format('ddd, MMM D, YYYY') }}
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex justify-end">
                  <roster-actions
                    :permissions="permissions"
                    :item="item"
                    :isApplicantTab="isApplicantTab"
                    :isMemberTab="isMemberTab"
                    :isRejectedTab="isRejectedTab"
                    :isDeletable="item.is_deletable"
                    @approved="updateMemberStatus(item.id, $event)"
                    @rejected="updateMemberStatus(item.id, $event)"
                    @removed="$refs.deleteDialog.showDialog(item)"
                  >
                    <template #activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <template #top="{ can_edit_members }">
                      <roster-member-form-dialog
                        v-if="item.form && can_edit_members && formID"
                        :rosterID="rosterInfo.id"
                        :formID="item.form.id"
                        :memberStatus="item.status"
                        readOnly
                      >
                        <template #activator="{ on }">
                          <v-list-item v-on="on">
                            <v-list-item-icon>
                              <v-icon>mdi-eye</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-subtitle>
                                View Form
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </roster-member-form-dialog>

                      <roster-member-form-dialog
                        v-if="
                          currentMember &&
                          currentMember.id === item.id &&
                          formID
                        "
                        @onUpdate="updateFormIDForMember"
                        :formID="item.form ? item.form.id : null"
                        :rosterID="rosterInfo.id"
                        :member="item"
                      >
                        <template #activator="{ on }">
                          <v-list-item v-on="on">
                            <v-list-item-icon>
                              <v-icon>mdi-eye</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-subtitle>
                                Edit Form
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </roster-member-form-dialog>

                      <v-list-item
                        v-if="
                          can_edit_members &&
                          isMemberTab &&
                          item.id !== currentMember.id
                        "
                        @click="$refs.memberDialog.getMember(item.id)"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-account-cog-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            Edit Permissions
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </roster-actions>
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <div
            class="justify-center align-center py-2"
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
        </v-row>
      </v-sheet>
    </v-container>
    <roster-member-dialog
      v-model="openMemberDialog"
      v-if="permissions.can_edit_members && isMemberTab"
      ref="memberDialog"
      :permissions="permissions"
      :priority="currentMember.rank.priority"
      @save="onMemberApply"
    >
    </roster-member-dialog>
    <delete-dialog
      v-model="openDeleteDialog"
      v-if="permissions.can_remove_members"
      ref="deleteDialog"
      :length="selected.length"
      :itemText="'username'"
      @delete="removeMember"
    ></delete-dialog>
    <roster-application-dialog
      v-model="openRosterMemberForm"
      ref="form"
      :rosterID="rosterInfo.id"
      @onUpdate="disableApplyButton = true"
    />
    <v-overlay v-model="isPrivate" opacity="0.9" v-if="isPrivate">
      <v-container fluid>
        <v-row justify="center" align="center">
          <v-card width="800px" v-if="!openRosterMemberForm">
            <v-card-text>
              <div class="d-flex justify-center align-center flex-column">
                <v-icon :size="96">mdi-eye</v-icon>
                <h3>Private</h3>
                <p>
                  This is a private roster. Restricted to members and above.
                </p>

                <v-btn
                  class="my-4"
                  @click="openRosterMemberForm = true"
                  large
                  :disabled="memberIsPending || disableApplyButton"
                  >Apply To Roster</v-btn
                >
                <v-btn class="my-4" large @click="$router.push('/rosters')"
                  >Back to Rosters</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-overlay>
  </v-container>
</template>

<script>
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isBoolean from 'lodash/isBoolean';

import UserAvatar from '~/components/avatar/ListAvatar.vue';
import RosterActions from '~/components/rosters/RosterActions.vue';
import RosterRankField from '~/components/rosters/RosterRankField.vue';
import RosterDialog from '~/components/rosters/RosterDialog.vue';

import RosterApplicationDialog from '~/components/rosters/RosterApplyFormDialog.vue';
import RosterMemberFormDialog from '~/components/rosters/RosterMemberFormDialog.vue';
import RosterRanksDialog from '~/components/rosters/RosterRanksDialog.vue';
import RosterMemberDialog from '~/components/rosters/RosterMemberDialog.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog2.vue';
import BreadCrumbs from '~/components/controls/BreadCrumbs.vue';

const isTrue = (value) => value === true;

export default {
  name: 'RosterContainer',

  props: {
    hideBreadcrumbs: {
      type: Boolean,
      default: false,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    UserAvatar,
    RosterActions,
    RosterDialog,
    RosterApplicationDialog,
    RosterMemberFormDialog,
    RosterRanksDialog,
    RosterRankField,
    RosterMemberDialog,
    DeleteDialog,
    BreadCrumbs,
  },

  async mounted() {
    await this.fetchRoster();
    if (this.isPrivate) {
      document.documentElement.style.overflow = 'hidden';
    }
  },

  data() {
    return {
      rosterInfo: {
        id: null,
        name: '',
        icon: null,
        banner: null,
        private: false,
        is_disabled: false,
        enable_recruitment: false,
        auto_approve: false,
        apply_roles_on_approval: false,
        roles: [],
        roster_form: null,
      },

      openSettings: false,
      openMediaDialog: false,
      openRosterMemberForm: false,
      openMemberDialog: false,
      openDeleteDialog: false,
      disableApplyButton: false,

      currentMember: null,

      permissions: {
        can_add_members: false,
        can_edit_members: false,
        can_edit_member_ranks: false,
        can_remove_members: false,
        can_add_ranks: false,
        can_edit_ranks: false,
        can_remove_ranks: false,
        can_edit_roster_details: false,
        can_delete_roster: false,
      },

      formID: null,

      ranks: [],

      tab: 0,
      tabNames: ['approved', 'pending', 'rejected'],

      headers: {
        pending: [
          {
            text: 'APPLICANT',
            sortable: false,
            value: 'username',
          },
          {
            text: '',
            sortable: false,
            align: 'end',
            value: 'actions',
          },
        ],
        approved: [
          {
            text: 'MEMBER',
            sortable: false,
            value: 'username',
          },
          {
            text: 'RANK',
            sortable: true,
            value: 'rank',
          },
          {
            text: 'MEMBER SINCE',
            sortable: true,
            value: 'approved_on',
          },
          {
            text: '',
            align: 'end',
            sortable: false,
            value: 'actions',
          },
        ],
        rejected: [
          {
            text: 'APPLICANT',
            sortable: false,
            value: 'username',
          },
          {
            text: '',
            sortable: false,
            align: 'end',
            value: 'actions',
          },
        ],
      },
      members: {
        pending: {
          nextCursor: '',
          prevCursor: '',
          hasMore: false,
          loading: false,
          items: [],
          selected: [],
          exclude: [],
        },
        approved: {
          nextCursor: '',
          prevCursor: '',
          hasMore: false,
          loading: false,
          items: [],
          selected: [],
          exclude: [],
        },
        rejected: {
          nextCursor: '',
          prevCursor: '',
          hasMore: false,
          loading: false,
          items: [],
          selected: [],
          exclude: [],
        },
      },
    };
  },

  methods: {
    async onChange() {
      if (!this.computedMembers.length) {
        await this.fetchMembers();
      }
    },
    onMemberApply(member) {
      this.currentMember = Object.assign(
        this.currentMember ? this.currentMember : {},
        member
      );
    },
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.members && this.hasMore) {
        await this.fetch(`/rosters/members/${this.$route.params.id}`, {
          status: this.currentTab,
        });
      }
    },
    async deleteRoster() {
      try {
        const roster = await this.$axios.delete(
          `/roster/${this.rosterInfo.id}`,
          data
        );

        this.$toast.success(`Roster: ${roster.name} has been closed.`, {
          position: 'top-center',
        });
        this.$router.redirect('/');
      } catch (err) {
        this.$toast.success(err.message, { position: 'top-center' });
      }
    },
    async updateRoster(url) {
      const data = {};
      if (url !== this.banner) {
        Object.assign(data, { banner: url });
      }

      try {
        const item = this.$axios.$patch(`/roster/${this.rosterInfo.id}`, data);

        if (item) {
          this.setRosterData(item);
        }

        this.$toast.success(`Saved changes.`, { position: 'top-center' });
      } catch (err) {
        this.$toast.success(err.message, { position: 'top-center' });
      }
    },
    async updateMemberRank(id, { rank, previous }) {
      try {
        const item = await this.$axios.$patch(`/rosters/members/${id}`, {
          rank_id: rank.id,
        });

        if (item) {
          if (item.id === this.currentMember.id) {
            const { permissions, ...rank } = item;
            this.currentMember.rank = rank;
            if (permissions) {
              this.permissions = Object.assign(this.permissions, permissions);
            }
          }

          const members = this.members[this.currentTab].items;
          const member = members.find(({ id }) => id === item.id);
          if (member) {
            const rank = member.rank;
            Object.assign(rank, item.rank);
          }
          const message = `Changed rank from ${previous.name} to ${member.rank.name} on ${item.username}`;
          this.$toast.success(message, { position: 'top-center' });
        }
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, { position: 'top-center' });
      }
    },

    updateFormIDForMember({ form, member }) {
      if (member?.id) {
        if (this.currentMember.id === member.id) {
          this.formID = id;
        }
        const match = this.members[this.currentTab].items.find(
          (m) => m.id === member.id
        );

        if (match) {
          Object.assign(match, { form: { id: form } });
        }
      }
    },

    updateCurrentMember(rank) {
      if (rank) {
        if (this.currentMember.rank.id === rank.id) {
          if (this.currentMember.rank.name !== rank.name) {
            this.currentMember.rank.name = rank.name;
          }
          this.permissions = Object.assign(this.permissions, rank.permissions);
        }
      }
    },

    async removeMember(id) {
      let payload = {};
      let url = `/rosters/members/${id}`;
      if (!id && this.selected.length) {
        url = '/rosters/members';
        if (this.selected.length === 1) {
          url = `/rosters/members/${this.selected[0].id}`;
        } else {
          Object.assign(payload, {
            [id ? 'id' : 'ids']: this.selected.reduce((arr, selected) => {
              //if priority is 1, this is the owner and cannot be removed.
              if (selected.rank.priority === 1) {
                return arr;
              }
              arr.push(selected.id);
              return arr;
            }, []),
          });
        }
      }

      let request;
      if (Object.keys(payload).length) {
        request = this.$axios.$delete(url, payload);
      } else {
        request = this.$axios.$delete(url);
      }

      const members = await request;
      const current = this.members[this.currentTab];
      if (members) {
        if (!Array.isArray(members)) {
          const idx = current.items.findIndex(({ id }) => id === members.id);
          if (idx !== -1) {
            const member = current.items.splice(idx, 1)[0];
            this.$toast.success(`Removed member: ${member.username}`, {
              position: 'top-center',
            });
          }

          return;
        }
        const membersToRemove = members.map(({ id }) => id);
        current.items = current.items.filter(
          ({ id }) => !membersToRemove.includes(id)
        );
        this.$toast.success('Removed members.', {
          position: 'top-center',
        });
      }
    },

    async updateMemberStatus(id, userID, status) {
      const payload = { status };
      let url = `/rosters/members/${id}`;

      if (!this.selected?.length || this.selected?.length === 1) {
        Object.assign(payload, { userID });
      }

      if (!id && this.selected.length) {
        url = '/rosters/members';
        if (this.selected.length === 1) {
          url = `/rosters/members/${this.selected[0].id}`;
        } else {
          Object.assign(payload, {
            members: this.selected.map(({ id, userID }) => ({ id, userID })),
          });
        }
      }

      try {
        const members = await this.$axios.$patch(url, payload);
        const currentTab = this.currentTab;
        const current = this.members[currentTab];
        if (members) {
          if (Array.isArray(members)) {
            const target = this.members[members[0].status];

            target.exclude = members.map(({ id }) => id);
            target.items.unshift(...members);
            current.items = current.items.filter(
              ({ id }) => !target.exclude.includes(id)
            );
          } else {
            const target = this.members[members.status];
            target.exclude.push(members.id);
            const idx = current.items.findIndex(({ id }) => id === members.id);
            if (idx !== -1) {
              current.items.splice(idx, 1);
              target.items.unshift(members);
            }
          }
        }

        this.$toast.success('Saved changes.', { position: 'top-center' });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }
    },
    setPageInfo(items) {
      if (items && items.results.length) {
        this.computedMembers = items.results;

        if (items?.pageInfo?.hasMore) {
          this.hasMore = items.pageInfo.hasMore;
        }

        if (items?.pageInfo?.next) {
          this.nextCursor = items.pageInfo.next;
        }

        if (items?.pageInfo?.previous) {
          this.prevCursor = items.pageInfo.previous;
        }
      }
    },
    setRosterData(data) {
      Object.keys(data).forEach((key) => {
        if (this.rosterInfo[key] !== undefined) {
          this.rosterInfo[key] = data[key];
        }
      });
    },
    async fetchRoster() {
      try {
        const { members, member, ranks, roster_form, ...roster } =
          await this.$axios.$get(`/rosters/${this.$route.params.slug}`);

        if (roster_form) {
          this.formID = roster_form.id;
        }

        if (ranks?.length) {
          this.ranks = ranks;
        }

        if (members?.results?.length) {
          this.setPageInfo(members);
        }

        if (member) {
          const { permissions, ...currentMember } = member;
          this.currentMember = currentMember;
          this.permissions = Object.assign(
            this.permissions,
            pickBy(currentMember.rank.permissions, isTrue),
            pickBy(permissions, isTrue)
          );
        }

        this.setRosterData(roster);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchMembers() {
      const params = {
        status: this.currentTab,
        exclude: this.exclude,
      };
      this.loading = true;
      try {
        const items = await this.$axios.$get(
          `/rosters/${this.rosterInfo.id}/members`,
          { params }
        );
        this.setPageInfo(items);
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      } finally {
        this.loading = false;
      }
    },
  },

  computed: {
    hasPermissionsForActions() {
      return this.permissions
        ? this.permissions.can_add_members ||
            this.permissions.can_edit_members ||
            this.permissions.can_remove_members
        : false;
    },

    hasPermissionsForRanks() {
      return this.permissions
        ? this.permissions.can_add_ranks ||
            this.permissions.can_edit_ranks ||
            this.permissions.can_remove_ranks
        : false;
    },
    currentTab() {
      return this.tabNames[this.tab];
    },
    isPrivate() {
      return (
        this.$auth.loggedIn &&
        this.rosterInfo.private &&
        (!this.currentMember || this.currentMember?.status !== 'approved')
      );
    },
    isApplicantTab() {
      return this.currentTab === 'pending';
    },
    isMemberTab() {
      return this.currentTab === 'approved';
    },
    isRejectedTab() {
      return this.currentTab === 'rejected';
    },
    memberIsPending() {
      return this.currentMember?.status === 'pending';
    },
    tabs() {
      return [
        {
          name: 'Members',
        },
        {
          name: 'Applicants',
          conditions: [
            [this.permissions.can_add_members],
            [this.permissions.can_edit_members],
            [this.permissions.can_remove_members],
          ],
        },
        {
          name: 'Rejected',
          conditions: [
            [this.permissions.can_edit_members],
            [this.permissions.can_remove_members],
          ],
        },
      ];
    },
    computedTabs() {
      return this.tabs.reduce((arr, tab) => {
        const { conditions } = tab;
        if (conditions) {
          if (!Array.isArray(conditions)) {
            conditions = [[conditions]];
          } else if (Array.isArray(conditions) && conditions.every(isBoolean)) {
            conditions = [conditions];
          }

          const sufficient = conditions.some((con) =>
            con.every((condition) => condition)
          );

          if (!sufficient) return arr;
        }
        arr.push(tab);
        return arr;
      }, []);
    },
    computedMembers: {
      get() {
        return this.members[this.currentTab].items.map((member) => {
          // if (this.currentMember) {
          //   member =
          //     member.id === this.currentMember.id ? this.currentMember : member;
          // }
          member.rank = this.ranks.find((rank) => rank.id === member.rank.id);
          return member;
        });
      },
      set(value) {
        this.members[this.currentTab].items.push(...value);
      },
    },
    loading: {
      get() {
        return this.members[this.currentTab].loading;
      },
      set(value) {
        this.members[this.currentTab].loading = value;
      },
    },
    hasMore: {
      get() {
        return this.members[this.currentTab].hasMore;
      },
      set(value) {
        this.members[this.currentTab].hasMore = value;
      },
    },
    nextCursor: {
      get() {
        return this.members[this.currentTab].nextCursor;
      },
      set(value) {
        this.members[this.currentTab].nextCursor = value;
      },
    },
    prevCursor: {
      get() {
        return this.members[this.currentTab].prevCursor;
      },
      set(value) {
        this.members[this.currentTab].prevCursor = value;
      },
    },
    selected: {
      get() {
        return this.members[this.currentTab].selected;
      },
      set(value) {
        this.members[this.currentTab].selected = value;
      },
    },
    exclude: {
      get() {
        return this.members[this.currentTab].excluded;
      },
      set(value) {
        this.members[this.currentTab].excluded = value;
      },
    },
  },
};
</script>

<style scoped lang="scss">
body {
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}

.banner {
  position: relative;
}

.private-overlay {
  background: inherit;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  &:before {
    content: '';
    background: inherit;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    box-shadow: inset 0 0 3000px rgba(255, 255, 255, 0.3);
    filter: blur(10px);
  }
}
</style>
