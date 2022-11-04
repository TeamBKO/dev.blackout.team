<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="(settings, key) in groups" :key="key">
            <v-expansion-panel-header
              ><strong>{{
                key.charAt(0).toUpperCase() + key.slice(1)
              }}</strong></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-list>
                <v-list-item v-for="(setting, idx) in settings" :key="idx">
                  <template #default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>{{ setting.title }}</span>
                        <v-tooltip bottom v-if="setting.info">
                          <template #activator="{ on, attrs }">
                            <v-icon v-on="on" v-bind="attrs"
                              >mdi-information-outline</v-icon
                            >
                          </template>
                          <span>{{ setting.info }}</span>
                        </v-tooltip>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        setting.description
                      }}</v-list-item-subtitle>
                      <template v-if="setting.type === 'string'">
                        <v-text-field
                          v-model="setting.value"
                          dense
                          solo-inverted
                          :rules="setting.rules"
                        ></v-text-field>
                      </template>
                    </v-list-item-content>
                    <v-list-item-action>
                      <template v-if="setting.type === 'boolean'">
                        <v-checkbox
                          v-model="setting.value"
                          :input-value="active"
                        ></v-checkbox>
                      </template>
                      <template v-else-if="setting.type === 'integer'">
                        <div class="d-inline-flex">
                          <v-text-field
                            v-model.number="setting.value"
                            dense
                            @keydown="onKeyDown"
                            type="number"
                            solo
                            :min="setting.min"
                            :max="setting.max"
                          ></v-text-field>
                          <v-select
                            class="pl-1"
                            filled
                            dense
                            v-if="setting.selected"
                            v-model="setting.selected"
                            :items="setting.selectOptions"
                          ></v-select>
                        </div>
                      </template>
                    </v-list-item-action>
                  </template>
                </v-list-item>
                <div class="d-flex flex-column" v-if="key === 'discord'">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        >Create/Edit Discord Message</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >Create/Edit the message you want displayed on your
                        welcome channel, or the entry point for recruitment.
                        Only 25 rosters can be shown at a time. Doesn't work
                        with web hooks.</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <discord-message-editor>
                        <template #activator="{ on }">
                          <v-btn depressed small v-on="on">Edit</v-btn>
                        </template>
                        <!-- <template #prepand-content>
                          <accordion @click.native.once="getRosters">
                            <template #title>
                              <span
                                >ROSTERS
                                <v-tooltip top>
                                  <template #activator="{ on }">
                                    <v-icon v-on="on" left
                                      >mdi-alert-circle-outline</v-icon
                                    >
                                  </template>
                                  Select the rosters you want to display on the
                                  message as button links.
                                </v-tooltip></span
                              >
                            </template>
                            <roster-list
                              v-model="selectedRosters"
                            ></roster-list>
                          </accordion>
                        </template> -->
                      </discord-message-editor>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Watch Discord Roles</v-list-item-title>
                      <v-list-item-subtitle
                        >Watch for specific roles to be assigned to discord
                        users and if mapped to a site role, apply
                        them.</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <setting-discord-roles v-model="watchedDisordRoles">
                        <template #activator="{ on }">
                          <v-btn small depressed v-on="on">Edit</v-btn>
                        </template>
                      </setting-discord-roles>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list>
                        <v-list-item
                          v-for="(watched, i) in watchedDisordRoles"
                          :key="i"
                        >
                          <v-list-item-action>
                            <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              watched.name
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <action-bar
      v-model="showActionBar"
      @save="save"
      @reset="reset"
      :text="'Save changes.'"
      :disable="isDisabled"
    ></action-bar>
  </v-container>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
import ROSTERS from '~/constants/rosters/public.js';
import setPageTitle from '~/middleware/setPageTitle.js';
import cloneDeep from 'lodash/cloneDeep';
import snakeCase from 'lodash/snakeCase';

import ActionBar from '~/components/controls/ActionBar.vue';
import SettingDiscordRoles from '~/components/settings/SettingDiscordRoles.vue';
import DiscordMessageEditor from '~/components/discord/DiscordMessageEditorDialog.vue';
import Accordion from '~/components/controls/Accordion.vue';
import RosterList from '~/components/rosters/RosterList.vue';

const reduce = (sets) =>
  Object.entries(sets).reduce((output, [key, item]) => {
    const newItem = {
      key: snakeCase(key),
      type: item.type,
      title: item.title,
      description: item.description,
      value: item.value,
    };

    if (item.rules && item.rules.length) {
      Object.assign(newItem, { rules: item.rules });
    }

    if (item.selected) {
      Object.assign(newItem, {
        selected: item.selected,
        selectOptions: item.selectOptions,
      });
    }

    if (item.info) Object.assign(newItem, { info: item.info });

    if (!output[item.group]) {
      output[item.group] = [];
      output[item.group].push(newItem);
    } else {
      output[item.group].push(newItem);
    }
    return output;
  }, {});

export default {
  name: 'SiteSettings',

  layout: 'admin',

  components: {
    ActionBar,
    SettingDiscordRoles,
    DiscordMessageEditor,
    Accordion,
    RosterList,
  },

  middleware: [
    'auth',
    setPageTitle('Site Settings'),
    ({ $auth, store, redirect, $permissions }) => {
      const { VIEW_ALL_ADMIN, VIEW_ALL_SETTINGS } = $permissions;

      if ($auth.loggedIn) {
        if (!$auth.hasScope([VIEW_ALL_ADMIN, VIEW_ALL_SETTINGS])) {
          redirect('/');
        }
      } else {
        redirect('/');
      }
    },
  ],

  asyncData(ctx) {
    const sets = ctx.store.getters[SETTINGS.getters.SETTINGS]();
    const groups = reduce(sets);
    return {
      groups,
      panel: Array.from({ length: Object.keys(groups).length }, (v, i) => i),
    };
  },

  data() {
    return {
      isSaving: false,
      showActionBar: false,
      watchedDisordRoles: [],
      selectedRosters: [],
    };
  },

  methods: {
    onKeyDown(evt) {
      if (!/^\d{2,}$/.test(evt.key)) {
        evt.preventDefault();
      }
    },

    async save() {
      await this.$store.dispatch(SETTINGS.actions.SAVE_SETTINGS, this.toUpdate);
      this.groups = reduce(this.$store.getters[SETTINGS.getters.SETTINGS]());
    },

    reset() {
      this.groups = reduce(this.$store.getters[SETTINGS.getters.SETTINGS]());
    },

    getRosters() {
      const rosters = this.$store.getters[ROSTERS.getters.ITEMS];
      if (rosters.length) return;
      this.$store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
    },
  },

  watch: {
    hasUnsavedChanges(v) {
      this.showActionBar = v;
    },
  },

  computed: {
    baseSettings() {
      return reduce(this.$store.getters[SETTINGS.getters.SETTINGS]());
    },

    toUpdate() {
      return Object.keys(this.baseSettings).reduce((output, key) => {
        const g = this.groups[key];

        Object.assign(
          output,
          this.baseSettings[key].reduce((o, b, i) => {
            if (b.value !== g[i].value) {
              o[b.key] = g[i].value;
            }
            return o;
          }, {})
        );

        return output;
      }, {});
    },

    hasUnsavedChanges() {
      return !!Object.keys(this.toUpdate).length;
    },

    isDisabled() {
      return !this.hasUnsavedChanges;
    },
  },
};
</script>
