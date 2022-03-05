<template>
  <v-dialog v-model="open" :max-width="800">
    <v-card :max-width="800">
      <v-toolbar dark>
        <v-toolbar-title>Create A Roster</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs v-model="tab" @change="onChange">
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
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-badge avatar bordered overlap>
                          <v-avatar>
                            <v-img
                              :src="editable.icon"
                              v-if="editable.icon"
                            ></v-img>
                            <v-icon v-else>mdi-help-circle-outline</v-icon>
                          </v-avatar>
                        </v-badge>
                      </v-list-item-avatar>
                      <v-list-item-content>
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
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-list>
                      <v-list-item class="px-0">
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <span>Enable Recruitment</span>
                            <v-tooltip bottom>
                              <template #activator="{ on, attrs }">
                                <v-icon right v-on="on" v-bind="attrs"
                                  >mdi-information-outline</v-icon
                                >
                              </template>
                              <span
                                >Allows guests and members to apply to the
                                roster.</span
                              >
                            </v-tooltip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-switch
                            v-model="editable.enable_recruitment"
                          ></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <span>Apply roles on approval</span>
                            <v-tooltip bottom>
                              <template #activator="{ on, attrs }">
                                <v-icon right v-on="on" v-bind="attrs"
                                  >mdi-information-outline</v-icon
                                >
                              </template>
                              <span
                                >Apply site roles to applicants that are
                                approved</span
                              >
                            </v-tooltip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-switch
                            v-model="editable.apply_roles_on_approval"
                          ></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <span>Private</span>
                            <v-tooltip bottom>
                              <template #activator="{ on, attrs }">
                                <v-icon right v-on="on" v-bind="attrs"
                                  >mdi-information-outline</v-icon
                                >
                              </template>
                              <span
                                >Makes the roster private. Only applicants
                                approved to member and above will be able to see
                                it.</span
                              >
                            </v-tooltip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-switch v-model="editable.private"></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <span>Disable</span>
                            <v-tooltip bottom>
                              <template #activator="{ on, attrs }">
                                <v-icon right v-on="on" v-bind="attrs"
                                  >mdi-information-outline</v-icon
                                >
                              </template>
                              <span
                                >The roster is disabled and inaccessible to
                                everyone besides those with admin control panel
                                access.</span
                              >
                            </v-tooltip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-switch v-model="editable.is_disabled"></v-switch>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12">
                    <roster-form-select
                      v-model="editable.selectedForm"
                    ></roster-form-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <roster-roles
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
  </v-dialog>
</template>
<script>
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
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

const defaultProps = {
  icon: null,
  name: '',
  enable_recruitment: false,
  apply_roles_on_approval: false,
  private: false,
  is_disabled: false,
  selectedForm: 0,
  selectedRoles: [],
};

export default {
  name: 'RostersDialog',

  components: { RosterRoles, RosterFormSelect },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    open(v) {
      if (!v) {
        if (this.id) {
          this.id = null;
        }
        this.tab = 0;
        this.clearData();
      } else {
        if (!this.forms.length) {
          this.$store.dispatch(FORMS.actions.FETCH, {
            url: '/forms',
          });
        }
      }
    },
  },

  data() {
    return {
      editable: {
        icon: null,
        name: '',
        enable_recruitment: false,
        apply_roles_on_approval: false,
        private: false,
        is_disabled: false,
        selectedForm: 0,
        selectedRoles: [],
      },

      mode: 'create',
      id: null,
      readOnly: false,
      tab: 0,
      isSending: false,
      valid: false,

      defaultProperties: {
        icon: null,
        name: '',
        enable_recruitment: false,
        apply_roles_on_approval: false,
        private: false,
        is_disabled: false,
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

    save() {
      this[this.mode]();
    },

    async create() {
      const data = Object.assign({}, this.editable);

      if (this.editable.selectedForm) {
        Object.assign(data, { form: this.editable.selectedForm });
      }

      if (this.editable.selectedRoles && this.editable.selectedRoles.length) {
        Object.assign(data, { roles: this.editable.selectedRoles });
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
      } catch (err) {
        this.editable = this.setData(this.editable, this.defaultProperties);
        console.log(err);
      }
    },

    setData(obj, items) {
      return Object.keys(obj).reduce((obj, key) => {
        if (typeof items[key] !== undefined) {
          obj[key] = items[key];
        }
        return obj;
      }, {});
    },

    async setEditableContent(id, readOnly = false) {
      this.mode = 'edit';
      this.open = true;
      this.isSending = true;

      if (id) {
        this.id = id;
      }

      try {
        const item = (await this.$axios.get(`/admin/rosters/${id}`)).data;

        if (item) {
          const cloned = cloneDeep(item);

          this.editable = Object.assign(
            this.editable,
            this.setData(this.editable, item)
          );

          this.defaultProperties = Object.assign(
            this.defaultProperties,
            this.setData(this.defaultProperties, cloned)
          );

          if (item.icon) {
            this.editable.icon = item.icon;
            this.defaultProperties.icon = cloned.icon;
          }
          if (item.roster_form) {
            this.$store.commit(FORMS.mutations.ADD_ITEM, item.roster_form);
            this.$store.commit(
              FORMS.mutations.EXCLUDE_FROM_FETCH,
              item.roster_form.id
            );
            this.editable.selectedForm = item.roster_form.id;
            this.defaultProperties.selectedForm = cloned.roster_form.id;
          }
          if (item.roles && item.roles.length) {
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
    },

    onChange(value) {
      if (this.tab === 1 && !this.roles.length) {
        this.$store.dispatch(ROLES.actions.FETCH, {
          loader: null,
          isInitial: false,
        });
      }
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

    isDirty() {
      return Object.keys(this.defaultProperties).some((key) => {
        if (typeof this.editable[key] !== undefined) {
          const editable = this.editable[key];
          if (key === 'selectedRoles') {
            return this.editable.selectedRoles.some(
              (id) => !this.defaultProperties.selectedRoles.includes(id)
            );
          } else {
            return this.defaultProperties[key] !== editable;
          }
        }
      });
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
