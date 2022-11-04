<template>
  <v-dialog
    v-model="open"
    :max-width="maxWidth"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <slot name="activator" v-bind="on" />
    </template>
    <v-card :max-width="maxWidth">
      <v-img height="200px" :src="bannerImage">
        <v-app-bar flat color="rgba(0,0,0,0)">
          <v-btn
            icon
            @click="toggleMediaDialog('banner')"
            v-if="displayMediaDialog"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="open = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-app-bar>
        <v-card-title class="white--text mt-8">
          <v-badge
            avatar
            bordered
            overlap
            @click.native="toggleMediaDialog('icon')"
            v-if="displayMediaDialog"
          >
            <template #badge>
              <v-btn x-small icon>
                <v-icon x-small color="white">mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-avatar size="56">
              <img :src="editable.icon" alt="" />
            </v-avatar>
          </v-badge>
          <v-avatar size="56" v-else>
            <img :src="editable.icon" alt="" />
          </v-avatar>
          <div class="d-flex flex-grow-1 ml-5">
            <v-text-field
              v-model="editable.name"
              :label="'Name'"
              :rules="[
                isRequired('Name'),
                isAlphanumeric('Name'),
                minLength('Name', 3),
                maxLength('Name', 30),
              ]"
            ></v-text-field>
          </div>
        </v-card-title>
      </v-img>
      <v-tabs v-model="tab">
        <v-tab>Details</v-tab>
        <v-tab :disabled="!botIsEnabled">DISCORD</v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item eager>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <!-- <roster-form-select
                      v-model="editable.selectedForm"
                      :items.sync="internalForms"
                    ></roster-form-select> -->
                    <form-selector
                      v-model="editable.selectedForm"
                      :currentForm="form"
                    >
                      <template
                        #remove-form="{ form }"
                        v-if="editable.selectedForm"
                      >
                        <v-list-item @click="editable.selectedForm = 0">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-icon left>mdi-close</v-icon>
                              <span>Remove Form</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </form-selector>
                  </v-col>
                  <v-col
                    cols="12"
                    class="py-0"
                    v-for="(setting, key) in standardSettings"
                    :key="key"
                  >
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ setting.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ setting.description }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action v-if="setting.type === 'boolean'">
                        <v-switch v-model="editable[key]"></v-switch>
                      </v-list-item-action>
                      <v-list-item-action v-else-if="setting.type === 'string'">
                        <v-text-field
                          v-model="editable[key]"
                          filled
                        ></v-text-field>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>

                  <v-col cols="12" class="py-0">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>Private</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Makes the roster private. Only applicants approved to
                          member and above will be able to see it.
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch v-model="editable.private"></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" v-if="hasApplyOnRoles">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title
                          >Apply roles on approval</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Apply site roles to applicants that are approved
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          v-model="editable.apply_roles_on_approval"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                  <v-col
                    cols="12"
                    class="py-0"
                    v-if="editable.apply_roles_on_approval"
                  >
                    <roles-selector
                      v-model="editable.selectedRoles"
                      :items="roles"
                    ></roles-selector>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-tab-item>
          <v-tab-item :disabled="!botIsEnabled">
            <v-col
              cols="12"
              v-for="(setting, key) in discordSettings"
              :key="key"
            >
              <v-list-item two-lines class="px-0">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ setting.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ setting.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="setting.type === 'boolean'">
                  <v-switch v-model="editable[key]"></v-switch>
                </v-list-item-action>
                <v-list-item-action v-else-if="setting.type === 'string'">
                  <v-text-field v-model="editable[key]" filled></v-text-field>
                </v-list-item-action>
              </v-list-item>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
        <v-overlay absolute v-model="isSending">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :disabled="!isValid" @click="save">Save</v-btn>
        <v-btn text @click="resetData">Reset</v-btn>
      </v-card-actions>
    </v-card>
    <media-dialog
      v-if="displayMediaDialog"
      v-model="openMediaDialog"
      v-bind="mediaOptions"
      @setImage="setImage"
    ></media-dialog>
  </v-dialog>
</template>
<script>
import SETTINGS from '~/constants/settings/public.js';

import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import uniqBy from 'lodash/uniqBy';
import pick from 'lodash/pick';
import mediaPermissions from '~/mixins/mediaPermissions.js';
import FORMS from '~/constants/forms/public.js';
import ROSTERS from '~/constants/rosters/public.js';
import {
  isAlphanumeric,
  isRequired,
  minLength,
  maxLength,
} from '~/utilities/validators.js';

import RosterRoles from './RosterRoles.vue';
import RolesSelector from '~/components/roles/RolesSelector.vue';
import RosterFormSelect from './RosterFormSelect.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';
import FormSelector from '~/components/form/FormSelector.vue';

const defaultProps = {
  icon: null,
  banner: null,
  name: '',
  enable_recruitment: false,
  auto_approve: false,
  apply_roles_on_approval: false,
  private: false,
  is_disabled: false,
  show_fields_as_columns: false,

  selectedForm: 0,
  selectedRoles: [],

  link_to_discord: false,
  assign_discord_roles_on_approval: false,
  applicant_form_channel_id: '',
};

export default {
  name: 'RostersDialog',

  components: {
    RosterRoles,
    RosterFormSelect,
    MediaDialog,
    RolesSelector,
    FormSelector,
  },

  mixins: [mediaPermissions],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Create A Roster',
    },
    maxWidth: {
      type: Number,
      default: 950,
    },
    settings: {
      type: Object,
      default: () => {},
    },
  },

  watch: {
    settings: {
      deep: true,
      handler: function (settings) {
        this.setContent(settings);
      },
    },

    async open(v) {
      // if (!v) {
      //   if (this.id) {
      //     this.id = null;
      //   }
      //   this.tab = 0;
      //   this.clearData();
      // } else {
      //   if (!this.forms.length) {
      //     const { results } = await this.$store.dispatch(FORMS.actions.FETCH, {
      //       url: '/forms',
      //     });
      //     this.internalForms = results;
      //   } else {
      //     this.internalForms = [...this.forms];
      //   }
      // }
      if (!v) {
        if (this.id) {
          this.id = null;
        }
        this.tab = 0;
        this.clearData();
      }
    },
  },

  data() {
    return {
      mediaOptions: {
        fileSize: 600000,
        fullscreen: true,
        buttonText: 'SET BANNER IMAGE',
      },

      editable: {
        banner: null,
        icon: null,
        name: '',
        enable_recruitment: false,
        auto_approve: false,
        apply_roles_on_approval: false,
        private: false,
        is_disabled: false,
        show_fields_as_columns: false,
        selectedForm: 0,
        selectedRoles: [],
        link_to_discord: false,
        assign_discord_roles_on_approval: false,
        applicant_form_channel_id: '',
      },

      standardSettings: {
        enable_recruitment: {
          type: 'boolean',
          name: 'Enable recruitment',
          description:
            'Allows designated site roles to apply for the roster. (By default this is guests and recruits/members)',
        },
        auto_approve: {
          type: 'boolean',
          name: 'Auto approve applicants',
          description:
            'Applicants do not need to be manually approved and are automatically assigned the role of recruit on the roster.',
        },
        // private: {
        //   type: "boolean",
        //   name: "Make roster private",
        //   description: "Only specified site roles will be able to view and interact with the roster (by default: admin)"
        // },
        is_disabled: {
          type: 'boolean',
          name: 'Disable roster',
          description:
            'Roster cannot be seen or interacted with anyone outside of admins or roster owners',
        },
        show_fields_as_columns: {
          type: 'boolean',
          name: 'Show roster form fields as table columns',
          description:
            'Selected roster form columns are displayed on the table as columns',
        },
      },

      discordSettings: {
        link_to_discord: {
          type: 'boolean',
          name: 'Link to discord',
          description:
            'Displays an applicants roster form to specified channel if enabled. Disables batch functionality.',
        },
        applicant_form_channel_id: {
          type: 'string',
          name: 'Applicant form Channel ID',
          description:
            'Discord Channel ID where you want the bot to display the applicant forms.',
        },
        assign_discord_roles_on_approval: {
          type: 'boolean',
          name: 'Assign Discord Roles On Approval',
          description:
            'When applicant is approved, selected discord roles will be automatically applied.',
        },
      },

      roles: [],
      form: null,
      imageToSet: '',

      mode: 'create',
      id: null,
      readOnly: false,
      tab: 0,
      isSending: false,
      valid: false,
      openMediaDialog: false,

      defaultProperties: {
        banner: null,
        icon: null,
        name: '',
        enable_recruitment: false,
        auto_approve: false,
        apply_roles_on_approval: false,
        private: false,
        is_disabled: false,
        show_fields_as_columns: false,
        selectedForm: 0,
        selectedRoles: [],
        link_to_discord: false,
        assign_discord_roles_on_approval: false,
        applicant_form_channel_id: '',
      },
    };
  },

  methods: {
    isRequired,
    isAlphanumeric,
    minLength,
    maxLength,

    toggleMediaDialog(key) {
      this.imageToSet = key;
      if (!this.openMediaDialog) {
        this.openMediaDialog = true;
      }
      this.mediaOptions.buttonText = `SET ${key.toUpperCase()} IMAGE`;
    },

    setImage(image) {
      this.editable[this.imageToSet] = image;
      this.imageToSet = '';
    },

    save() {
      this[this.mode]();
    },

    async create() {
      const data = Object.assign(
        {},
        Object.keys(this.editable).reduce((obj, key) => {
          if (this.editable[key] && key !== 'selectedRoles') {
            obj[key] = this.editable[key];
          }
          return obj;
        }, {})
      );

      if (this.editable.selectedRoles && this.editable.selectedRoles.length) {
        Object.assign(data, { selectedRoles: this.editable.selectedRoles });
      }

      this.isSending = true;

      try {
        await this.$store.dispatch(ROSTERS.actions.ADD_ITEM, data);
        this.open = false;
      } catch (err) {
        console.error(err);
      } finally {
        this.isSending = false;
      }
    },

    async edit() {
      const payload = Object.keys(this.defaultProperties).reduce((obj, key) => {
        let editable = this.editable[key];

        if (!isUndefined(editable)) {
          if (key === 'selectedRoles') {
            obj.roles = this.editable.selectedRoles;
          } else {
            if (this.defaultProperties[key] !== this.editable[key]) {
              obj[key] = this.editable[key];
            }
          }
        }
        return obj;
      }, {});

      try {
        const item = await this.$store.dispatch(ROSTERS.actions.UPDATE_ITEM, {
          id: this.id,
          payload,
        });

        // if (item) {
        //   this.defaultProperties = this.setData(this.defaultProperties, item);
        // }
        // this.$emit('onUpdate', item);
      } catch (err) {
        this.editable = this.setData(this.editable, this.defaultProperties);
        console.log(err);
      }
    },

    setData(obj, items) {
      return Object.keys(obj).reduce((obj, key) => {
        if (!isUndefined(items[key])) {
          obj[key] = items[key];
        }
        return obj;
      }, {});
    },

    setContent(content) {
      const cloned = cloneDeep(content);

      this.editable = Object.assign(
        this.editable,
        this.setData(this.editable, content)
      );

      this.defaultProperties = Object.assign(
        this.defaultProperties,
        this.setData(this.defaultProperties, cloned)
      );

      if (content.roster_form) {
        // this.internalForms = uniqBy(
        //   [content.roster_form, ...this.internalForms],
        //   'id'
        // );
        this.form = content.roster_form;
        this.editable.selectedForm = content.roster_form.id;
        this.defaultProperties.selectedForm = cloned.roster_form.id;
      } else {
        this.form = null;
        this.editable.selectedForm = 0;
        this.defaultProperties.selectedForm = 0;
      }
      if (content.roles && content.roles.length) {
        this.roles = content.roles;
        this.editable.selectedRoles = content.roles.map(({ id }) => id);
        this.defaultProperties.selectedRoles = [...this.editable.selectedRoles];
      }
    },

    async setEditableContent(id, content = null, readOnly = false) {
      this.mode = 'edit';
      this.open = true;
      this.isSending = true;

      if (id) {
        this.id = id;
      }

      try {
        const settings = await this.$axios.$get(`/rosters/${id}/settings`);
        this.setContent(settings);
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    resetData() {
      this.editable = Object.assign(
        this.editable,
        this.setData(this.editable, this.defaultProperties)
      );
      this.editable.selectedRoles = this.defaultProperties.selectedRoles;
      this.editable.selectedForm = this.defaultProperties.selectedForm;
    },

    clearData() {
      this.mode = 'create';
      if (this.id) {
        this.id = null;
      }

      this.editable = { ...defaultProps };
      this.defaultProperties = { ...defaultProps };
      this.imageToSet = '';
      this.roles = [];
      this.internalForms = [];
    },
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    botIsEnabled() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES]('enableBot');
    },

    bannerImage() {
      return this.editable.banner || this.selectedBanner;
    },

    isDirty() {
      return Object.keys(this.defaultProperties).some((key) => {
        if (typeof this.editable[key] !== undefined) {
          const editable = this.editable[key];
          return this.defaultProperties[key] !== editable;
          // if (key === 'selectedRoles') {
          //   return this.editable.selectedRoles.some(
          //     (id) => !this.defaultProperties.selectedRoles.includes(id)
          //   );
          // } else {
          //   return this.defaultProperties[key] !== editable;
          // }
        }
      });
    },

    hasApplyOnRoles() {
      return this.editable.apply_roles_on_approval !== undefined;
    },

    isRolesTab() {
      return this.tab === 1;
    },

    forms() {
      return this.$store.getters[FORMS.getters.ITEMS];
    },

    isValid() {
      return this.isDirty && this.valid;
    },
  },
};
</script>
