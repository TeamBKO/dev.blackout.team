<template>
  <v-dialog id="user-dialog" v-model="show" :max-width="600" :min-width="600">
    <template v-slot:activator="{ on, attrs }" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>
    <v-card>
      <v-toolbar dark extended>
        <v-toolbar-title>
          <span class="headline">{{ title }}</span>
        </v-toolbar-title>
        <template #extension>
          <v-tabs fixed-tabs v-model="tab">
            <v-tab>Details</v-tab>
            <v-tab>Policies</v-tab>
          </v-tabs>
        </template>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="clear">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-container>
                <v-row v-if="isEditMode">
                  <v-col cols="12" class="text-center">
                    <v-badge
                      avatar
                      bordered
                      overlap
                      @click.native.stop="$emit('edit-profile-image')"
                    >
                      <template v-slot:badge>
                        <v-avatar class="elevation-1">
                          <v-icon>mdi-image-edit-outline</v-icon>
                        </v-avatar>
                      </template>
                      <v-avatar size="80" color="primary">
                        <v-img :src="avatar" alt v-if="avatar" />
                        <span class="white--text headline" v-else>{{
                          initials
                        }}</span>
                      </v-avatar>
                    </v-badge>
                  </v-col>
                </v-row>
                <v-row>
                  <template v-for="(input, key) in inputs">
                    <v-col cols="12" v-if="input.visible" :key="key">
                      <dialog-input
                        v-model="input.value"
                        :async="input.async"
                        :type="input.type"
                        :label="input.label"
                        :rules="input.rules"
                        :name="input.async ? key : false"
                        :is-shown="show"
                      />
                    </v-col>
                  </template>
                  <v-col cols="12">
                    <v-select
                      label="User status"
                      v-model="userActive"
                      :items="selectItems"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedRoles"
                      :items="roles"
                      :item-text="'name'"
                      :item-value="'id'"
                      :search-input.sync="search"
                      multiple
                      deletable-chips
                      small-chips
                      label="Roles"
                    >
                      <template #append-item>
                        <div
                          v-intersect.quiet="{
                            threshold: 1.0,
                            handler: onIntersect,
                          }"
                        ></div>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row align="center" v-if="isEditMode">
                  <v-col cols="12">
                    <v-btn block color="primary" @click="resetPassword"
                      >Reset Password</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <user-policies
            v-model="policies"
            :tabIsActive="tab === 1"
          ></user-policies>
        </v-tab-item>
      </v-tabs-items>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="!valid">Save</v-btn>
        <v-btn text @click="reset">Reset</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import USERS from '~/constants/users/public.js';
import ROLES from '~/constants/roles/public.js';

import policies from '~/mixins/policies.js';

import DialogInput from '~/components/dialogs/DialogInput.vue';
import UserPolicies from '~/components/roles/Policies.vue';

import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'UserDialog',
  components: { DialogInput, UserPolicies },
  mixins: [policies],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Create New User',
    },
  },

  data() {
    return {
      inputs: {
        username: {
          async: true,
          visible: true,
          label: 'Username',
          type: 'text',
          value: '',
        },
        email: {
          async: true,
          visible: true,
          label: 'Email',
          type: 'text',
          value: '',
        },
        password: {
          async: false,
          visible: true,
          label: 'Password',
          type: 'password',
          value: '',
          rules: [
            (v) => !!v || 'Password is required.',
            (v) => (v && v.length <= 50) || 'Password is too long.',
            (v) =>
              (v && v.length >= 8) ||
              'Password is too short. Must be equal to or greater than 8 characters.',
          ],
        },
      },

      // editable: {
      //   avatar: null,
      //   active: false,
      //   selectedRoles: [],
      // },

      tab: 0,
      avatar: '',

      selectItems: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      search: '',
      valid: false,

      isSending: false,
      userActive: false,
      defaultActiveState: false,

      selectedRoles: [],

      /**
       * EDIT MODE
       */
      mode: 'create',
      id: null,
      startingRoles: null,
      startingDetails: null,
      startingAvatar: null,
    };
  },

  watch: {
    show(v) {
      if (!v) {
        this.$emit('close');
        this.clear();
      } else {
        this.$emit('open');
        this.$store.dispatch(ROLES.actions.FETCH, { url: '/roles' });
        // if (this.mode === 'create') {
        //   this.createNewUser();
        // }
      }
    },
  },

  methods: {
    setAvatar(avatar) {
      this.avatar = avatar;
    },

    onIntersect(observer, entries, isIntersecting) {
      if (this.isIntersecting) {
        this.$store.dispatch(ROLES.actions.FETCH, { url: '/roles' });
      }
    },

    async resetPassword() {
      const email = this.startingDetails.email;

      try {
        const resp = (
          await this.$axios.post('/users/password-reset', {
            type: 'admin',
            email: this.startingDetails.email,
          })
        ).data;

        this.$toast.success(resp.message, { position: 'top-center' });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }
    },

    async setEditableContent(id) {
      this.mode = 'edit';
      this.show = true;
      this.id = id;

      const user = await this.getUser(id);
      const starting = cloneDeep(user);

      if (user.roles && user.roles.length) {
        this.selectedRoles = user.roles.map(({ id }) => id);
        this.startingRoles = [...this.selectedRoles];
      }

      if (user.policies && user.policies.length) {
        this.policies = user.policies.map(({ id }) => id);
        this.startingPolicies = [...this.policies];
      }

      this.inputs.username.value = user.username;
      this.inputs.email.value = user.email;
      this.inputs.password.visible = false;

      this.avatar = user.avatar;
      this.userActive = user.active;

      this.defaultActiveState = user.active;
      this.startingDetails = pick(starting, ['username', 'email']);

      this.startingAvatar = starting.avatar;
    },

    async getUser(id) {
      this.isSending = true;
      try {
        const result = (await this.$axios.get(`/admin/users/${id}`)).data;

        console.log('result', result);

        return result;
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      } finally {
        this.isSending = false;
      }
    },

    // async createNewUser() {
    //   this.mode = 'create';
    //   this.policies = this.setPolicies(await this.getPolicies(), null);
    // },

    save() {
      this[this.mode]();
    },

    async create() {
      this.isSending = true;

      let data = Object.values(this.inputs).reduce(
        (obj, o) => {
          const k = o.label.toLowerCase();
          obj[k] = o.value;
          return obj;
        },
        { active: this.userActive }
      );

      if (this.avatar) {
        Object.assign(data, { avatar: this.avatar });
      }

      try {
        await this.$store.dispatch(USERS.actions.ADD_ITEM, data);
        this.show = false;
      } catch (err) {
        console.error(err);
      } finally {
        this.isSending = false;
      }
    },

    setPayload(data) {
      if (this.addRoles && this.addRoles.length) {
        Object.assign(data, { addRoles: this.addRoles });
      }
      if (this.removeRoles && this.removeRoles.length) {
        Object.assign(data, { removeRoles: this.removeRoles });
      }
      if (this.addPolicies && this.addPolicies.length) {
        Object.assign(data, { addPolicies: this.addPolicies });
      }
      if (this.removePolicies && this.removePolicies.length) {
        Object.assign(data, {
          removePolicies: this.removePolicies,
        });
      }
      return data;
    },

    async edit() {
      let data = {};
      let details = { ...this.detailsToUpdate } || {};

      if (this.avatar !== this.startingAvatar) {
        Object.assign(details, { avatar: this.avatar });
      }

      if (this.defaultActiveState !== this.userActive) {
        Object.assign(details, { active: this.userActive });
      }

      if (details && Object.keys(details).length) {
        Object.assign(data, { details });
      }

      const payload = this.setPayload(data);

      console.log(data);

      this.isSending = true;

      try {
        await this.$store.dispatch(USERS.actions.UPDATE_ITEM, {
          id: this.id,
          payload,
        });
        // await this.editUser({
        //   id: this.id,
        //   payload,
        // });
        this.show = false;
        // this.$toast.success('Saved Changes.', { position: 'top-center' });
      } catch (err) {
        this.reset();
        this.$toast.error(err.message, { position: 'top-center' });
      } finally {
        this.isSending = false;
      }
    },

    reset() {
      if (this.isEditMode) {
        const defaultValues = { ...this.startingDetails };
        const defaultRoles = [...this.startingRoles];
        const defaultPolicies = [...this.startingPolicies];
        // const defaultRoles = cloneDeep(this.startingRoles);
        this.avatar = this.startingAvatar;
        this.userActive = this.defaultActiveState;
        this.inputs.username.value = defaultValues.username;
        this.inputs.email.value = defaultValues.email;
        this.selectedRoles = defaultRoles;
        this.policies = defaultPolicies;
      } else {
        this.inputs.username.value = '';
        this.inputs.email.value = '';
        this.inputs.password.value = '';
        this.selectedRoles = [];
        this.policies = [];
      }
    },

    clear() {
      this.show = false;
      this.$nextTick(() =>
        setTimeout(() => {
          this.mode = 'create';
          this.$refs.form.reset();
          this.$refs.form.resetValidation();
          this.inputs.password.visible = true;
          this.selectedRoles = [];
          this.policies = [];
          this.startingPolicies = [];

          this.defaultActiveState = false;
          this.startingRoles = null;
          this.startingDetails = null;
          this.startingAvatar = '';
          if (this.id) this.id = null;
        }, 50)
      );
    },
  },

  computed: {
    roles() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },

    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    isEditMode() {
      return this.mode === 'edit';
    },

    username() {
      return this.inputs.username.value;
    },

    initials() {
      const username = this.username ? this.username.match(/\b\w/g) : null;
      const initials = username
        ? ((username.shift() || '') + (username.pop() || '')).toUpperCase()
        : '';
      return initials;
    },

    detailsToUpdate() {
      const details = this.startingDetails
        ? Object.entries(this.startingDetails).reduce((output, [key, item]) => {
            if (item !== this.inputs[key].value) {
              output[key] = this.inputs[key].value;
            }
            return output;
          }, {})
        : null;

      return details;
    },

    addRoles() {
      // return this.roles.some((role) => this.startingRoles.indexOf(role) === -1);
      return this.selectedRoles.filter(
        (role) => !this.startingRoles.includes(role)
      );
    },

    removeRoles() {
      // return this.startingRoles.some((role) => this.roles.indexOf(role) === -1);
      return this.startingRoles.filter(
        (role) => !this.selectedRoles.includes(role)
      );
    },
  },
};
</script>
