<template>
  <v-container fluid class="pa-0">
    <v-toolbar :height="300" extended>
      <template #img>
        <v-img
          :src="banner"
          eager
          :max-height="300"
          :content-class="'profile-banner'"
        >
          <v-container fill-height>
            <v-btn
              v-if="permissions.can_edit_roster_details"
              absolute
              top
              right
              icon
              @click="updateRoster"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
            <v-list-item>
              <v-list-item-avatar :size="96" :style="{ overflow: 'visible' }">
                <v-avatar :src="''"></v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <div class="text-md-h3 text sm-and-down h5 text-shadow">
                    {{ name }}
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-container>
        </v-img>
      </template>
      <template #extension>
        <v-container>
          <v-tabs v-model="tab" @change="onChange">
            <v-tab>Members</v-tab>
            <v-tab>Applicants</v-tab>
            <v-tab>Rejected</v-tab>
            <v-spacer></v-spacer>
            <div class="v-tab">
              <v-icon left>mdi-chevron-triple-up</v-icon>
              <span>Manage Ranks</span>
            </div>
            <roster-dialog
              v-model="openSettings"
              ref="settings"
              :title="'Roster Settings'"
            >
              <template #activator="{ on }">
                <div
                  class="v-tab"
                  @click="
                    $refs.settings.setEditableContent(
                      $route.params.id,
                      settings,
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
            >
              <template #activator="{ on }">
                <div class="v-tab" v-on="on">
                  actions
                  <v-icon small>mdi-chevron-down</v-icon>
                </div>
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
    <!-- <v-img
      :src="banner"
      eager
      :max-height="400"
      :content-class="'profile-banner'"
    >
      <v-container fill-height>
        <v-list-item>
          <v-list-item-avatar :size="96" :style="{ overflow: 'visible' }">
            <v-avatar :src="''"></v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <div class="text-md-h3 text sm-and-down h5 text-shadow">
                {{ name }}
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-container>
      <div class="fill-height bottom-gradient"></div> -->
    <!-- </v-img> -->
    <v-container>
      <v-sheet rounded class="my-6" elevation="2">
        <v-row>
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              disable-pagination
              show-select
              hide-default-footer
              :items="members[currentTab].items"
              :headers="headers[currentTab]"
            >
              <template #item.member="{ item }">
                <v-list-item class="px-0">
                  <v-list-item-avatar>
                    <user-avatar :item="item.member" :size="40" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.member.username }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template #item.rank="{ item }">
                <v-list-item class="px-0">
                  <v-list-item-icon>
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
                    @changeStatus="updateMember(item.id, $event)"
                  >
                    <template #activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <template #top="{ can_edit_members }">
                      <v-list class="pa-0">
                        <v-list-item
                          v-if="item.form && can_edit_members"
                          @click="
                            $refs.form.viewForm(item.form.id, $route.params.id)
                          "
                        >
                          <v-list-item-icon>
                            <v-icon>mdi-eye</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-subtitle>
                              View Form
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="memberId === item.id">
                          <v-list-item-icon>
                            <v-icon>mdi-eye</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-subtitle>
                              Edit Form
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
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
    <roster-application-dialog
      v-model="openRosterMemberForm"
      ref="form"
    ></roster-application-dialog>
  </v-container>
</template>

<script>
import pick from 'lodash/pick';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
import RosterActions from '~/components/rosters/RosterActions.vue';
import RosterDialog from '~/components/rosters/RosterDialog.vue';
import RosterApplicationDialog from '~/components/rosters/RosterApplicantDialog.vue';
export default {
  name: 'RosterContainer',

  components: {
    UserAvatar,
    RosterActions,
    RosterDialog,
    RosterApplicationDialog,
  },

  async mounted() {
    await this.fetchRoster(`/rosters/${this.$route.params.id}`);
  },

  data() {
    return {
      memberId: '',
      openSettings: false,
      name: '',
      icon: '',
      banner:
        'https://images.ctfassets.net/j95d1p8hsuun/1ShvIkEIe3cvb5qKSguLdC/9bbac0c4239985ca540650ec240d765b/HOME_USP1_FightTheWorld_CPB-L-1920x720.jpg',
      private: false,
      is_disabled: false,
      enable_recruitment: false,
      apply_roles_on_approval: false,
      tab: 0,
      ranks: [],
      rank: {
        icon: null,
        name: '',
      },
      tabNames: ['approved', 'pending', 'rejected'],
      settings: null,
      permissions: {
        can_add_members: false,
        can_edit_members: false,
        can_remove_members: false,
        can_edit_roster_details: false,
        can_delete_roster: false,
      },
      openRosterMemberForm: false,
      headers: {
        pending: [
          {
            text: 'APPLICANT',
            sortable: false,
            value: 'member',
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
            value: 'member',
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
            value: 'member',
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
        },
        approved: {
          nextCursor: '',
          prevCursor: '',
          hasMore: false,
          loading: false,
          items: [],
          selected: [],
        },
        rejected: {
          nextCursor: '',
          prevCursor: '',
          hasMore: false,
          loading: false,
          items: [],
          selected: [],
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
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.members && hasMore) {
        await this.fetch(`/rosters/members/${this.$route.params.id}`, {
          status: this.currentTab,
        });
      }
    },
    async deleteRoster() {},
    async updateRoster() {},
    async updateMember(id, status) {
      const payload = { status };
      try {
        const member = await this.$axios.$patch(`/rosters/member/${id}`);
        const record = this.computedMembers.find((m) => m.id === member.id);
        if (record) {
          Object.assign(record, member);
          this.$toast.success(`Updated member: ${member.name}`, {
            position: 'top-center',
          });
        }
      } catch (err) {
        console.log(err);
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
        if (this[key] !== undefined) {
          this[key] = data[key];
        }
      });
    },
    async fetchRoster() {
      try {
        const { members, member, ...roster } = await this.$axios.$get(
          `/rosters/${this.$route.params.id}`
        );

        const settings = pick(roster, [
          'name',
          'icon',
          'banner',
          'enable_recruitment',
          'apply_roles_on_approval',
          'private',
          'is_disabled',
        ]);

        this.settings = settings;

        if (members?.results?.length) {
          this.setPageInfo(members);
        }

        if (member?.rank) {
          const rank = member.rank;
          this.memberId = member.id;
          this.rank.name = rank.name;
          this.rank.icon = rank.icon;
          if (rank?.permissions) {
            for (let key in rank.permissions) {
              if (typeof this.permissions[key] !== undefined) {
                this.permissions[key] = rank.permissions[key];
              }
            }
          }
        }

        this.setRosterData(roster);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchMembers() {
      const params = {
        status: this.currentTab,
      };
      this.loading = true;
      try {
        const items = await this.$axios.$get(
          `/rosters/${this.$route.params.id}/members`,
          { params }
        );
        this.setPageInfo(items);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },

  computed: {
    currentTab() {
      return this.tabNames[this.tab];
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
    computedMembers: {
      get() {
        return this.members[this.currentTab].items;
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
  },
};
</script>
