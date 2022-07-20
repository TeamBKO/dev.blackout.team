<template>
  <v-dialog
    v-model="open"
    :max-width="800"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <slot name="activator" v-bind="on" />
    </template>
    <v-card :max-width="800">
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
      <!-- <v-toolbar dark>
        <v-tooltip v-if="displayMediaDialog">
          <template #activator="{ on }">
            <v-btn v-on="on" icon @click="$emit('openMedia')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          Set the banner image for the banner.
        </v-tooltip>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar> -->
      <v-tabs v-model="tab">
        <v-tab>Details</v-tab>
        <v-tab :disabled="!editable.apply_roles_on_approval">Roles</v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item eager>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <roster-form-select
                      v-model="editable.selectedForm"
                      :items.sync="internalForms"
                    ></roster-form-select>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title>
                          Enable Recruitment
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Allows guests and members to apply to the roster.
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          v-model="editable.enable_recruitment"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title>Auto approve</v-list-item-title>
                        <v-list-item-subtitle>
                          Applicants are automatically granted member rank when
                          they apply.
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch v-model="editable.auto_approve"></v-switch>
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
                  <v-col cols="12">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title
                          >Show form fields as columns</v-list-item-title
                        >
                        <v-list-item-subtitle>
                          Show select form fields as additional table columns.
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          v-model="editable.show_fields_as_columns"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12">
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
                  <v-col cols="12">
                    <v-list-item two-lines class="px-0">
                      <v-list-item-content>
                        <v-list-item-title> Disable </v-list-item-title>
                        <v-list-item-subtitle>
                          The roster is disabled and inaccessible to everyone
                          besides those with admin control panel access.
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch v-model="editable.is_disabled"></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <roster-roles
              v-if="hasApplyOnRoles"
              v-model="editable.selectedRoles"
              :tabIsActive="isRolesTab"
            ></roster-roles>
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
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import uniqBy from 'lodash/uniqBy';
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
import RosterFormSelect from './RosterFormSelect.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';

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
};

export default {
  name: 'RostersDialog',

  components: { RosterRoles, RosterFormSelect, MediaDialog },

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
  },

  watch: {
    async open(v) {
      if (!v) {
        if (this.id) {
          this.id = null;
        }
        this.tab = 0;
        this.clearData();
      } else {
        if (!this.forms.length) {
          const { results } = await this.$store.dispatch(FORMS.actions.FETCH, {
            url: '/forms',
          });
          this.internalForms = results;
        } else {
          this.internalForms = [...this.forms];
        }
      }
    },
  },

  data() {
    return {
      mediaOptions: {
        fileSize: 600000,
        single: true,
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
      },

      internalForms: [],
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
        if (typeof this.editable[key] !== undefined) {
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

        if (item) {
          this.defaultProperties = this.setData(this.defaultProperties, item);
        }
        this.$emit('onUpdate', item);
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

    async setEditableContent(id, content, fetch = true, readOnly = false) {
      this.mode = 'edit';
      this.open = true;
      this.isSending = true;

      if (id) {
        this.id = id;
      }

      try {
        let item;

        if (fetch) {
          item = await this.$axios.$get(`/admin/rosters/${id}`);
        } else {
          item = content;
        }

        if (item) {
          const cloned = cloneDeep(item);

          this.editable = Object.assign(
            this.editable,
            this.setData(this.editable, item)
          );

          console.log('item', item);

          this.defaultProperties = Object.assign(
            this.defaultProperties,
            this.setData(this.defaultProperties, cloned)
          );

          if (item.roster_form) {
            this.internalForms = uniqBy(
              [item.roster_form, ...this.internalForms],
              'id'
            );
            this.editable.selectedForm = item.roster_form.id;
            this.defaultProperties.selectedForm = cloned.roster_form.id;
          }
          if (item.roles && item.roles.length) {
            console.log('item.roles', item.roles);
            this.editable.selectedRoles = item.roles.map(({ id }) => id);
            this.defaultProperties.selectedRoles = [
              ...this.editable.selectedRoles,
            ];
          }
        }
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
      return typeof this.editable.apply_roles_on_approval !== undefined;
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
