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
            <roster-analytics :rosterID="rosterInfo.id">
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  <v-icon left>mdi-chart-multiple</v-icon>
                  <span>Analytics</span>
                </div>
              </template>
            </roster-analytics>
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
              @approved="updateMemberStatus(null, null, $event)"
              @rejected="updateMemberStatus(null, null, $event)"
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
                <v-dialog
                  v-model="openDeleteRosterPrompt"
                  max-width="500"
                  persistent
                >
                  <template #activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-icon>
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-subtitle
                          >Delete Roster</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <v-card>
                    <v-card-title>Delete Roster</v-card-title>
                    <v-card-text>
                      <p>
                        Do you wish to proceed with deleting the entire roster?
                      </p>
                      <strong>This is irrevesible.</strong>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text color="error" @click="deleteRoster"
                        >Delete</v-btn
                      >
                      <v-btn text @click="openDeleteRosterPrompt = false"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
              hide-default-footer
              :show-select="hasPermissionsForActions"
              :items="members[currentTab].items"
              :headers="computedHeaders[currentTab]"
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
                  v-if="
                    permissions.can_edit_member_ranks &&
                    currentMember.rank.priority <= item.rank.priority
                  "
                  :value="item.rank"
                  :id="rosterInfo.id"
                  :priority="currentMember.rank.priority"
                  @save="updateMemberRank(item.id, $event)"
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
                    :isApplicantTab="isApplicantTab"
                    :isMemberTab="isMemberTab"
                    :isRejectedTab="isRejectedTab"
                    :isDeletable="item.is_deletable"
                    @approved="updateMemberStatus(item.id, item.userID, $event)"
                    @rejected="updateMemberStatus(item.id, item.userID, $event)"
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
                        @onUpdate="updateMemberThroughForm"
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
      :rosterID="rosterInfo.id"
      @save="updateMember"
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
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import cloneDeep from 'lodash/cloneDeep';
import RANKS from '~/constants/rosters/ranks/public.js';

import UserAvatar from '~/components/avatar/ListAvatar.vue';
import RosterActions from '~/components/rosters/RosterActions.vue';
import RosterRankField from '~/components/rosters/RosterRankField.vue';
import RosterDialog from '~/components/rosters/RosterDialog.vue';

import RosterApplicationDialog from '~/components/rosters/RosterApplyFormDialog.vue';
import RosterMemberFormDialog from '~/components/rosters/RosterMemberFormDialog.vue';
import RosterRanksDialog from '~/components/rosters/RosterRanksDialog.vue';
import RosterMemberDialog from '~/components/rosters/RosterMemberDialog.vue';
import RosterAnalytics from '~/components/rosters/RosterAnalytics.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog2.vue';
import BreadCrumbs from '~/components/controls/BreadCrumbs.vue';

import deleteRoster from './mixins/deleteRoster.js';
import updateRoster from './mixins/updateRoster.js';
import fetchRoster from './mixins/fetchRoster.js';
import fetchMembers from './mixins/fetchMembers.js';
import removeMember from './mixins/removeMember.js';
import updateMember from './mixins/updateMember.js';
import updateMemberRank from './mixins/updateMemberRank.js';
import updateMemberStatus from './mixins/updateMemberStatus.js';

export default {
  name: 'RosterContainer',

  mixins: [
    deleteRoster,
    updateRoster,
    fetchRoster,
    fetchMembers,
    removeMember,
    updateMember,
    updateMemberRank,
    updateMemberStatus,
  ],

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
    RosterAnalytics,
    DeleteDialog,
    BreadCrumbs,
  },

  async mounted() {
    await this.fetchRoster();

    // if (this.additionalColumns.length) {
    //   this.headers = Object.entries(this.headers).reduce(
    //     (obj, [key, header]) => {
    //       obj[key] = header.splice(
    //         1,
    //         0,
    //         ...this.additionalColumns.map((column) => ({
    //           text: column.toUpperCase().replace('_', ' '),
    //           sortable: false,
    //           value: snakeCase(column),
    //         }))
    //       );
    //       return obj;
    //     },
    //     {}
    //   );
    // }
    if (this.isPrivate) {
      document.documentElement.style.overflow = 'hidden';
    }
  },

  // watch: {
  //   additionalColumns(columns) {
  //     if (columns.length) {
  //       const headers = this.headers[this.currentTab];
  //       headers.splice(
  //         1,
  //         0,
  //         ...columns.map((column) => ({
  //           text: column.toUpperCase().replace('_', ' '),
  //           sortable: false,
  //           value: snakeCase(column),
  //         }))
  //       );
  //     }
  //   },
  // },

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
        show_fields_as_columns: false,
        roles: [],
        roster_form: null,
      },

      additionalColumns: [],

      openSettings: false,
      openMediaDialog: false,
      openRosterMemberForm: false,
      openMemberDialog: false,
      openDeleteDialog: false,
      openDeleteRosterPrompt: false,
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
    async getAnalytics() {
      try {
        const data = this.$axios.get(
          `/rosters/analytics/${this.rosterInfo.id}`
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

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

    updateMemberThroughForm({ formID, member }) {
      console.log('member', member);

      if (member?.id) {
        if (this.currentMember.id === member.id) {
          this.formID = formID;
        }
        const match = this.members[this.currentTab].items.find(
          (m) => m.id === member.id
        );

        if (match) {
          Object.assign(match, member);
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

    setMemberData(arr) {
      return arr.map((item) => {
        const fields = item?.form?.fields?.length
          ? item.form.fields.reduce((obj, field) => {
              obj[snakeCase(field.alias)] = field.answer.value;
              return obj;
            }, {})
          : {};
        return Object.assign(item, fields);
      });
    },

    setPageInfo(items) {
      if (items && items.results.length) {
        this.computedMembers = this.setMemberData(items.results);

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
  },

  computed: {
    applyRoles() {
      return this.rosterInfo.apply_roles_on_approval;
    },
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
    computedHeaders() {
      if (this.rosterInfo.show_fields_as_columns) {
        return Object.entries(this.headers).reduce((obj, [key, header]) => {
          obj[key] = header.splice(
            1,
            0,
            ...this.additionalColumns.map((column) => ({
              text: column.toUpperCase().replace('_', ' '),
              sortable: false,
              value: snakeCase(column),
            }))
          );
          obj[key] = header;
          return obj;
        }, {});
      }
      return this.headers;
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
          member.form = { id: member.form.id };
          member.rank = this.$store.getters[RANKS.getters.ITEMS].find(
            (rank) => rank.id === member.rank.id
          );

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
        return this.members[this.currentTab].exclude;
      },
      set(value) {
        this.members[this.currentTab].exclude = value;
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
