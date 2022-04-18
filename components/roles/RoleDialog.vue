<template>
  <v-dialog id="role-dialog" v-model="show" :max-width="maxWidth" fullscreen>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>{{ name }}</v-toolbar-title>
        <v-btn small icon absolute right @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <template #extension>
          <v-tabs v-model="tab">
            <v-tab>Details</v-tab>
            <v-tab>Policies</v-tab>
            <v-tab :disabled="!botEnabled">
              <span>Discord Roles</span>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-text>
            <v-form v-model="valid">
              <v-container fluid>
                <v-row v-if="details">
                  <v-col cols="12">
                    <async-text-input
                      validate
                      v-model="details.name"
                      label="Name"
                      :endpoint="'/validate/role'"
                      :filled="false"
                      :readonly="readOnly"
                      required
                    ></async-text-input>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="details.level"
                      label="Level"
                      :items="levelOptions"
                      :readonly="readOnly"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <role-policies
            v-model="policies"
            :dialogStatus="show"
            :tabIsActive="tab === 1"
            :readonly="readOnly"
          ></role-policies>
        </v-tab-item>
        <v-tab-item>
          <discord-roles
            v-model="selectedDiscordRoles"
            :tabIsActive="tab === 2"
          ></discord-roles>
        </v-tab-item>
      </v-tabs-items>
      <v-card-actions v-if="!readOnly">
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="!valid">Save</v-btn>
        <v-btn text>Reset</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import { isRequired } from '~/utilities/validators.js';
import ROLES from '~/constants/roles/public.js';
import policies from '~/mixins/policies.js';
import settings from '~/constants/settings/public.js';

// import DialogInput from '~/components/dialogs/DialogInput.vue';
import AsyncTextInput from '~/components/inputs/AsyncTextInput.vue';
import RolePolicies from './Policies.vue';
import DiscordRoles from './DiscordRoles.vue';
import cloneDeep from 'lodash/cloneDeep';

const range = (start, end) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
};

const defaultDetails = {
  name: '',
  level: 5,
};

export default {
  name: 'RoleDialog',
  components: { AsyncTextInput, RolePolicies, DiscordRoles },

  mixins: [policies],

  data() {
    return {
      id: null,

      maxWidth: 600,

      tab: 0,

      icon: 'mdi-plus',
      confirmIcon: 'mdi-check',
      cancelIcon: 'mdi-close',

      details: null,
      startingDetails: null,
      levelOptions: [],

      selectedDiscordRoles: [],
      savedDiscordRoles: [],

      show: false,
      isSending: false,
      valid: false,
      editName: false,
      readOnly: false,
      mode: 'create',
    };
  },

  watch: {
    show(v) {
      if (!v) {
        this.$emit('close');
        this.reset();
      } else {
        this.$emit('open');
      }
    },
  },

  methods: {
    isRequired,

    save() {
      this[this.mode]();
    },

    async editRole(id, payload) {
      const defaultDetails = this.startDetails;
      const defaultPolicies = this.startingPolicies;
      const defaultDiscordRoles = this.savedDiscordRoles;

      this.isSending = true;

      try {
        const role = await this.$store.dispatch(ROLES.actions.UPDATE_ITEM, {
          id,
          payload,
        });

        console.log(role);

        this.setData(role);

        // this.$toast.success('Changes saved.', {
        //   icon: 'check',
        //   position: 'top-center',
        // });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, { position: 'top-center' });
        this.details = defaultDetails;
        this.policies = defaultPolicies;
        this.selectedDiscordRoles = defaultDiscordRoles;
      } finally {
        this.isSending = false;
      }
    },

    async getMoreDiscordRoles() {
      try {
        const roles = (await this.$axios.get('/admin/roles/discord')).data;
        return roles;
      } catch (err) {
        console.log(err);
      }
    },

    async getRole(id) {
      this.isSending = true;
      try {
        const data = (await this.$axios.get(`/admin/roles/${id}`)).data;
        return data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    setData(data) {
      const details = {};

      if (data) {
        if (data.name) {
          Object.assign(details, { name: data.name });
        }

        if (Number.isInteger(data.level)) {
          Object.assign(details, { level: data.level });
        }

        if (Object.keys(details).length) {
          this.details = details;
          this.startingDetails = { ...details };
        }

        if (data.discord_roles && data.discord_roles.length) {
          this.selectedDiscordRoles = data.discord_roles.map((role) => role.id);
          this.savedDiscordRoles = [...this.selectedDiscordRoles];
        }

        if (data.policies && data.policies.length) {
          this.policies = data.policies.map(({ id }) => id);
          this.startingPolicies = [...this.policies];
        }
      }

      // this.details = Object.assign({}, { name: data.name, level: data.level });
      // this.startingDetails = { ...this.details };
      // this.selectedDiscordRoles = data.discord_roles.map((role) => role.id);
      // this.savedDiscordRoles = [...this.selectedDiscordRoles];
    },

    create() {
      let data = { details: this.details };

      if (this.policies && this.policies.length) {
        Object.assign(data, { policies: this.policies });
      }

      if (this.selectedDiscordRoles && this.selectedDiscordRoles.length) {
        Object.assign(data, { discord_roles: this.selectedDiscordRoles });
      }

      this.$store.dispatch(ROLES.actions.ADD_ITEM, data);
    },

    edit() {
      let data = {};

      if (this.details && Object.keys(this.details).length) {
        const details = Object.entries(this.startingDetails).reduce(
          (output, [key, item]) => {
            if (item !== this.details[key]) output[key] = this.details[key];
            return output;
          },
          {}
        );

        Object.assign(data, {
          details,
        });
      }

      this.editRole(this.id, this.setPayload(data));
    },

    setPayload(data) {
      if (this.addPolicies && this.addPolicies.length) {
        Object.assign(data, { addPolicies: this.addPolicies, altered: true });
      }

      if (this.removePolicies && this.removePolicies.length) {
        Object.assign(data, {
          removePolicies: this.removePolicies,
          altered: true,
        });
      }

      if (this.botEnabled) {
        if (this.addDiscordRoles && this.addDiscordRoles.length) {
          Object.assign(data, {
            addDiscordRoles: this.addDiscordRoles,
            altered: true,
          });
        }

        if (this.removeDiscordRoles && this.removeDiscordRoles.length) {
          Object.assign(data, {
            removeDiscordRoles: this.removeDiscordRoles,
            altered: true,
          });
        }
      }

      return data;
    },

    async setNewContent() {
      this.mode = 'create';
      this.show = true;
      this.levelOptions = range(this.$auth.user.level, 5);
      this.details = Object.assign({}, defaultDetails);
    },

    async setEditableContent(id, readOnly = false) {
      this.mode = 'edit';
      this.readOnly = readOnly;
      this.id = id;

      this.show = true;

      const role = await this.getRole(id);
      const details = Object.assign({}, { name: role.name, level: role.level });

      // this.policies = this.setPolicies(selectable);
      this.levelOptions = range(this.$auth.user.level, 5);

      this.setData(role);
    },

    reset() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.startingPolicies = [];
          this.policies = [];
          this.readOnly = false;
          this.levelOptions = [];
          this.selectedDiscordRoles = [];
          this.savedDiscordRoles = [];
          this.details = null;
          this.startingDetails = null;
          if (this.id) this.id = null;
        }, 10);
      });
    },
  },

  computed: {
    isEditMode() {
      return this.mode === 'edit';
    },

    policyList() {
      return this.$store.getters[POLICIES.getters.ITEMS];
    },

    relateDiscordRoles() {
      return !this.selectedDiscordRoles.every((id) =>
        this.savedDiscordRoles.includes(id)
      );
    },
    addDiscordRoles() {
      return this.selectedDiscordRoles.reduce((arr, id) => {
        if (!this.savedDiscordRoles.includes(id)) {
          arr.push(id);
        }
        return arr;
      }, []);
    },
    removeDiscordRoles() {
      return this.savedDiscordRoles.reduce((arr, id) => {
        if (!this.selectedDiscordRoles.includes(id)) {
          arr.push(id);
        }
        return arr;
      }, []);
    },
    unrelateDiscordRoles() {
      return this.savedDiscordRoles.some(
        (role) => !this.selectedDiscordRoles.includes(role)
      );
    },
    botEnabled() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES]('enableBot');
    },
    name() {
      return this.mode === 'new'
        ? 'Create A Role'
        : this.startingDetails
        ? `Edit Role: ${this.startingDetails.name}`
        : 'Placeholder';
    },
  },
};
</script>

<style lang="scss">
#role-dialog {
  position: relative;
}
</style>
